import sqlite3 from "sqlite3"
import { Group } from "../../src/model/Group"
import { GroupUser } from "../../src/model/GroupUser"
import { ModelRole } from "../../src/model/ModelRole"
import { Role } from "../../src/model/Role"
import { User } from "../../src/model/User"

export class InMemoryDatabase {
  private db: sqlite3.Database
  private lastID: any

  constructor() {
    this.db = new sqlite3.Database(":memory:")
  }

  public getDb() {
    return this.db
  }

  async initialize() {
    return new Promise<void>((resolve, _reject) => {
      this.db.serialize(() => {
        this.db.run(`
                    CREATE TABLE user (
                      id INT PRIMARY KEY,
                      name VARCHAR(255) NULL,
                      email VARCHAR(255) NULL,
                      email_verified_at DATETIME NULL,
                      password VARCHAR(255) NOT NULL,
                      remember_token VARCHAR(255) NULL,
                      created_at DATETIME NOT NULL,
                      updated_at DATETIME NOT NULL,
                      created_by VARCHAR(255) NULL,
                      msisdn VARCHAR(255) NOT NULL,
                      otp VARCHAR(255) NOT NULL,
                      otp_created_at DATETIME NOT NULL,
                      personal_group_id INT NOT NULL,
                      image_uid VARCHAR(255) NULL,
                      verif_code VARCHAR(255) NULL,
                      verif_expir DATETIME NULL,
                      type VARCHAR(255) NOT NULL,
                      timezone VARCHAR(255) NULL,
                      avatar_url VARCHAR(255) NULL,
                      account_type INT NOT NULL,
                      is_deleted TINYINT NOT NULL,
                      deleted_timestamp DATETIME NULL
                  );
                `)

        this.db.run(`
                    CREATE TABLE users_reported_by_users (
                      id INT PRIMARY KEY,
                      user_id INT NOT NULL,
                      reported VARCHAR(255) NOT NULL,
                      date DATETIME NOT NULL
                  );
                `)

        this.db.run(`
                    CREATE TABLE users_blocked_by_users (
                      id INT PRIMARY KEY,
                      user_id INT NOT NULL,
                      blocked VARCHAR(255) NOT NULL,
                      date DATETIME NOT NULL
                  );
                `)

        this.db.run(`
                    CREATE TABLE role (
                      id INT PRIMARY KEY,
                      name VARCHAR(255) NOT NULL,
                      guard_name VARCHAR(255) NOT NULL,
                      created_at DATETIME NOT NULL,
                      updated_at DATETIME NOT NULL
                  );
                `)

        this.db.run(`
                    CREATE TABLE model_has_role (
                        role_id INTEGER,
                        model_type VARCHAR(191),
                        model_id INTEGER,
                        PRIMARY KEY (role_id, model_type, model_id)
                    )
                `)

        this.db.run(`
                    CREATE TABLE \`group\` (
                        id INTEGER PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        created_at DATETIME NOT NULL,
                        updated_at DATETIME NOT NULL,
                        is_public INTEGER NOT_NULL,
                        owner_id INTEGER,
                        image_uid VARCHAR(255),
                        image_url VARCHAR(255)
                    )
                `)

        this.db.run(`
                    CREATE TABLE group_user (
                        id INTEGER PRIMARY KEY,
                        user_id INTEGER NOT NULL,
                        group_id INTEGER NOT NULL
                    )
                `)

        resolve()
      })
    })
  }

  insertUser(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = `
                INSERT INTO user (
                    id, name, email, email_verified_at, password, remember_token,
                    created_at, updated_at, created_by, msisdn, otp, otp_created_at,
                    personal_group_id, image_uid, verif_code, verif_expir, type,
                    timezone, avatar_url, account_type, is_deleted, deleted_timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `
      this.db.run(
        sql,
        [
          user.id,
          user.name,
          user.email,
          user.email_verified_at,
          user.password,
          user.remember_token,
          user.created_at?.toISOString(),
          user.updated_at?.toISOString(),
          user.created_by,
          user.msisdn,
          user.otp,
          user.otp_created_at?.toISOString(),
          user.personal_group_id,
          user.image_uid,
          user.verif_code,
          user.verif_expir,
          user.type,
          user.timezone,
          user.avatar_url,
          user.account_type,
          user.is_deleted,
          user.deleted_timestamp,
        ],
        function (err) {
          if (err) {
            reject(err)
          } else {
            resolve(this.lastID)
          }
        }
      )
    })
  }

  insertGroup(group: Group): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = `
                INSERT INTO \`group\` (
                    id, name, created_at, updated_at, is_public,
                    owner_id, image_uid, image_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `
      this.db.run(
        sql,
        [
          group.id,
          group.name,
          group.created_at?.toISOString(),
          group.updated_at?.toISOString(),
          group.is_public,
          group.owner_id,
          group.image_uid,
          group.image_url,
        ],
        function (err) {
          if (err) {
            reject(err)
          } else {
            resolve(this.lastID)
          }
        }
      )
    })
  }

  insertGroupUser(userGroup: GroupUser): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql2 = `
                INSERT INTO group_user (
                    id, user_id, group_id
                ) VALUES (?, ?, ?);
            `
      this.db.run(sql2, [userGroup.id, userGroup.user_id, userGroup.group_id], function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(this.lastID)
        }
      })
    })
  }

  insertRole(role: Role): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = `
                INSERT INTO role (
                    id, name, guard_name, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?);
            `
      this.db.run(
        sql,
        [
          role.id,
          role.name,
          role.guard_name,
          role.created_at?.toISOString(),
          role.updated_at?.toISOString(),
        ],
        function (err) {
          if (err) {
            reject(err)
          } else {
            resolve(this.lastID)
          }
        }
      )
    })
  }

  insertModelHasRole(modelHasRole: ModelRole): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = `
                INSERT INTO model_has_role (
                    role_id, model_type, model_id
                ) VALUES (?, ?, ?);
            `
      this.db.run(
        sql,
        [modelHasRole.role_id, modelHasRole.model_type, modelHasRole.model_id],
        function (err) {
          if (err) {
            reject(err)
          } else {
            resolve(this.lastID)
          }
        }
      )
    })
  }

  close() {
    return new Promise<void>((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
