import db from '../utils/connectDB'
import ClientType from '../type/client.type'

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
