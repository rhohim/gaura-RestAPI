import db from '../utils/connectDB'
import PortfolioType from '../type/portfolio.type'

export const postPortfolioService = async (
  location: string,
  area: string,
  year: number,
  cover: string,
  highlight: number,
  copies: string[],
  image_URLs: string[],
  category_id: number,
  client_id: number
): Promise<PortfolioType> => {
  const clientsql = `SELECT client_name FROM client WHERE id = ?`
  const clientResult = await new Promise<any>((resolve, reject) => {
    db.query(clientsql, [client_id], (error: any, result: any) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })

  if (!clientResult || clientResult.length === 0) {
    throw new Error('Client not found')
  }

  const slug = clientResult[0].client_name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  const sql = `
    INSERT INTO portfolio 
      (location, area, year, cover, slug, highlight, 
      copy_1, copy_2, copy_3, copy_4, copy_5, copy_6,
      image_1, image_2, image_3, image_4, image_5, image_6,
      image_7, image_8, image_9, image_10, image_11, image_12,
      category_id, client_id)
    VALUES (?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?, 
            ?, ?)`

  const values = [location, area, year, cover, slug, highlight, ...copies, ...image_URLs, category_id, client_id]
  console.log(values)
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error: any, result: any) => {
      if (error) {
        reject(error)
      } else {
        resolve({
          id: result.insertId,
          location,
          area,
          year,
          cover,
          slug,
          highlight,
          copy_1: copies[0] || '',
          copy_2: copies[1] || '',
          copy_3: copies[2] || '',
          copy_4: copies[3] || '',
          copy_5: copies[4] || '',
          copy_6: copies[5] || '',
          image_1: image_URLs[0] || '',
          category_id,
          client_id
        } as PortfolioType)
      }
    })
  })
}
