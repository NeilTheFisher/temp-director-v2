import { IsNull, Repository } from "typeorm"
import { AppDataSource } from "../data-source"
import { Setting } from "../entity/Setting"
import { SettingInterface } from "../interfaces/Setting"

export class SettingService {
  private settingRepository: Repository<Setting>

  constructor() {
    this.settingRepository = AppDataSource.getRepository(Setting)
  }

  async getSystemSettings(): Promise<any> {
    const settingName = Setting.SYSTEM_SETTINGS
    const loadedSettings = await Setting.getLoadedSettings()
    if (loadedSettings.has(settingName)) {
      console.log(`Returning saved value: ${settingName}:${loadedSettings.get(settingName)}`)
      return loadedSettings.get(settingName)
    }
    console.log(`fetching value for ${settingName} from DB`)
    const settingObject = await this.settingRepository.findOne({
      where: { key: settingName, configurableType: IsNull(), configurableId: IsNull() },
    })
    const value = settingObject ? settingObject.value : null
    let result = null
    if(value != null)
    {
      result = JSON.parse(value)
    }
    return result
  }

  async getEventSettings(eventId: string): Promise<SettingInterface> {
    const settingName = Setting.EVENT_SETTINGS
    console.log(`fetching value for ${settingName} from DB`)
    const settingObject = await this.settingRepository.findOne({
      where: { key: settingName, configurableType: "App\\Models\\Event", configurableId: eventId },
    })
    const value = settingObject ? settingObject.value : ""
    let result = []
    if(value != null)
    {
      result = JSON.parse(value)
    }
    return result
  }

  async getModelSetting(settingName: string, modelId: string, modelClass: string, defaultValue: any = null)
  {
    console.log(`fetching value for ${settingName} from DB for class ${modelClass} and id ${modelId} with defaultValue ${defaultValue}`)
    const settingObject = await this.settingRepository.findOne({
      where: { key: settingName, configurableType: modelClass, configurableId: modelId },
    })
    return settingObject ? settingObject.value : defaultValue
  }
}
