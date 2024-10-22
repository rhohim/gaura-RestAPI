import db from '../utils/connectDB'
import ClientType from '../type/client.type'

export const getallClientService = async (): Promise<ClientType[]> => {
  const sql = 'SELECT * FROM client'

  return new Promise((resolve, reject) => {
    db.query(sql, (error: any, result: ClientType[]) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

export const postClientService = async (client_name: string, client_image_URL: string): Promise<ClientType> => {
  const sql = 'INSERT INTO client (client_name, client_image) VALUES (?,?)'
  const values = [client_name, client_image_URL]

  return new Promise((resolve, reject) => {
    db.query(sql, values, (error: any, result: any) => {
      if (error) {
        reject(error)
      } else {
        resolve({
          id: result.insertId,
          client_name: client_name,
          client_image: client_image_URL
        } as ClientType)
      }
    })
  })
}

export const deleteAllClientService = async (): Promise<void> => {
  const sql = 'DELETE FROM client'
  return new Promise((resolve, reject) => {
    db.query(sql, (error: any, result: any) => {
      if (error) {
        return reject(error)
      }

      const resetAutoIncrement = 'ALTER TABLE client AUTO_INCREMENT = 1'
      db.query(resetAutoIncrement, (error: any, result: any) => {
        if (error) {
          return reject(error)
        }
        resolve()
      })
    })
  })
}

export const getClientByIdService = async (clientId: number): Promise<ClientType> => {
  const sql = 'SELECT * FROM client WHERE id = ?'
  return new Promise((resolve, reject) => {
    db.query(sql, [clientId], (error: any, result: any) => {
      if (error) {
        console.error('Error Fetching client')
        return reject(error)
      }
      if (result.length === 0) {
        return reject(new Error('Client Not Found'))
      }

      resolve(result[0])
    })
  })
}

export const deleteClientByIdService = async (clientId: number): Promise<void> => {
  const sql = 'DELETE FROM client WHERE id = ?'
  return new Promise((resolve, reject) => {
    db.query(sql, [clientId], (error: any, result: any) => {
      if (error) {
        console.error('Error Deleteing client data by id')
        return reject(error)
      }
      resolve()
    })
  })
}

export const putClientByIdService = async (clientId: number, clientData: Partial<ClientType>) => {
  const fetchsql = 'SELECT client_name, client_image FROM client WHERE id =?'
  return new Promise((resolve, reject) => {
    db.query(fetchsql, [clientId], (error: any, result: any) => {
      if (error) {
        return reject(error)
      }

      if (result.length === 0) {
        return reject(new Error('Client Not Found'))
      }

      const existingValue = result[0]
      const updatename = clientData.client_name !== undefined ? clientData.client_name : existingValue.client_name
      const updateimage = clientData.client_image !== undefined ? clientData.client_image : existingValue.client_image
      const updatesql = 'UPDATE client SET client_name = ?, client_image = ? WHERE id = ?'
      db.query(updatesql, [updatename, updateimage, clientId], (error: any, result: any) => {
        if (error) {
          return reject(error)
        }
        resolve({
          id: clientId,
          client_name: updatename,
          client_image: updateimage
        } as ClientType)
      })
    })
  })
}
