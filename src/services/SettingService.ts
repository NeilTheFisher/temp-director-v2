import { IsNull, Repository } from "typeorm"
import { AppDataSource } from "../data-source"
import { Setting } from "../entity/Setting"

export class SettingService {
  private settingRepository: Repository<Setting>

  constructor() {
    this.settingRepository = AppDataSource.getRepository(Setting)
  }

  async getSystemSetting(settingName: string): Promise<unknown> {
    const loadedSettings = await Setting.getLoadedSettings()
    console.log(loadedSettings)
    if (loadedSettings.has(settingName)) {
      console.log(`Returning saved value: ${settingName}:${loadedSettings.get(settingName)}`)
      return loadedSettings.get(settingName)
    }
    console.log(`fetching value for ${settingName} from DB`)
    const settingObject = await this.settingRepository.findOne({
      where: { key: settingName, configurableType: IsNull(), configurableId: IsNull() },
    })
    const value = settingObject ? settingObject.value : null

    if (value) {
      loadedSettings.set(settingName, value)
      return value
    }
    return null
  }
}
