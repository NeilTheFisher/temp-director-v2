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

  async getSystemSettings(): Promise<any> {
    const settingName = Setting.SYSTEM_SETTINGS;
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
      result = JSON.parse(value);
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
