import type { PrismaClient } from "../prisma/generated/client";

import { eventSettingsKeys, type EventSettings, type SettingKey } from "./settings";
import { parseEventSettings } from "./settings";

/**
 * Helper class for managing settings in the database
 */
export class SettingsRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get a single setting value by key for a configurable entity
   */
  async getSetting(
    key: SettingKey,
    configurableType: string,
    configurableId: bigint
  ): Promise<string | null> {
    const setting = await this.prisma.setting.findFirst({
      where: {
        key,
        configurable_type: configurableType,
        configurable_id: configurableId,
      },
    });

    return setting?.value ?? null;
  }

  /**
   * Get all settings for a configurable entity as a key-value map
   */
  async getSettings(
    configurableType: string,
    configurableId: bigint
  ): Promise<Map<string, string>> {
    const settings = await this.prisma.setting.findMany({
      where: {
        configurable_type: configurableType,
        configurable_id: configurableId,
      },
    });

    const map = new Map<string, string>();

    for (const setting of settings) {
      if (eventSettingsKeys.includes(setting.key) && setting.value) {
        map.set(setting.key, setting.value);
      }
    }

    return map;
  }

  /**
   * Get all event settings for an event (merged with defaults)
   */
  async getEventSettings(eventId: bigint): Promise<EventSettings> {
    const settings = await this.prisma.setting.findMany({
      where: {
        configurable_type: "Event",
        configurable_id: eventId,
      },
    });

    // Build an object from the settings
    const settingsObj: Record<string, string> = {};

    for (const setting of settings) {
      if (eventSettingsKeys.includes(setting.key) && setting.value) {
        settingsObj[setting.key] = setting.value;
      }
    }

    // Parse with defaults
    return parseEventSettings(settingsObj);
  }

  /**
   * Set a single setting value
   */
  async setSetting(
    key: SettingKey,
    value: string,
    configurableType: string,
    configurableId: bigint
  ): Promise<void> {
    // Prisma doesn't have a compound unique constraint for this, so we do it manually
    const existing = await this.prisma.setting.findFirst({
      where: {
        key,
        configurable_id: configurableId,
        configurable_type: configurableType,
      },
    });

    if (existing) {
      await this.prisma.setting.update({
        where: { id: existing.id },
        data: { value },
      });
    } else {
      await this.prisma.setting.create({
        data: {
          key,
          value,
          configurable_type: configurableType,
          configurable_id: configurableId,
        },
      });
    }
  }

  /**
   * Set multiple settings at once for a configurable entity
   */
  async setSettings(
    settings: Record<SettingKey, string>,
    configurableType: string,
    configurableId: bigint
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      for (const [key, value] of Object.entries(settings)) {
        const existing = await tx.setting.findFirst({
          where: {
            key,
            configurable_id: configurableId,
            configurable_type: configurableType,
          },
        });

        if (existing) {
          await tx.setting.update({
            where: { id: existing.id },
            data: { value },
          });
        } else {
          await tx.setting.create({
            data: {
              key,
              value,
              configurable_type: configurableType,
              configurable_id: configurableId,
            },
          });
        }
      }
    });
  }

  /**
   * Set event settings (validates and stores as individual settings)
   */
  async setEventSettings(eventId: bigint, settings: Partial<EventSettings>): Promise<void> {
    // Store as individual settings
    const settingsRecord: Record<SettingKey, string> = {} as Record<SettingKey, string>;

    for (const [key, value] of Object.entries(settings)) {
      if (eventSettingsKeys.includes(key)) {
        settingsRecord[key as SettingKey] = String(value);
      }
    }

    await this.setSettings(settingsRecord, "Event", eventId);
  }

  /**
   * Delete a single setting
   */
  async deleteSetting(
    key: SettingKey,
    configurableType: string,
    configurableId: bigint
  ): Promise<void> {
    await this.prisma.setting.deleteMany({
      where: {
        key,
        configurable_type: configurableType,
        configurable_id: configurableId,
      },
    });
  }

  /**
   * Delete all settings for a configurable entity
   */
  async deleteSettings(configurableType: string, configurableId: bigint): Promise<void> {
    await this.prisma.setting.deleteMany({
      where: {
        configurable_type: configurableType,
        configurable_id: configurableId,
      },
    });
  }
}

/**
 * Create a settings repository instance
 */
export function createSettingsRepository(prisma: PrismaClient): SettingsRepository {
  return new SettingsRepository(prisma);
}
