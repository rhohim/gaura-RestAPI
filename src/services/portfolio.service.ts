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
  categories: number[],
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
      category_1_id, category_2_id, category_3_id,
      client_id)
    VALUES (?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?, 
            ?, ?, ?,
            ?)`

  const values = [location, area, year, cover, slug, highlight, ...copies, ...image_URLs, ...categories, client_id]
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
          category_1_id: categories[0] || null,
          category_2_id: categories[1] || null,
          category_3_id: categories[2] || null,
          client_id
        } as PortfolioType)
      }
    })
  })
}

export const putPortfolioByIdService = async (
  portfolioId: number,
  portfolioData: Partial<PortfolioType>
): Promise<PortfolioType> => {
  const fetchsql =
    'SELECT location, area, year, cover, highlight, copy_1, copy_2, copy_3, copy_4, copy_5, copy_6, image_1, image_2, image_3, image_4, image_5, image_6, image_7, image_8, image_9, image_10, image_11, image_12, category_1_id, category_2_id,category_3_id, client_id FROM portfolio WHERE id = ?'

  return new Promise((resolve, reject) => {
    db.query(fetchsql, [portfolioId], (error: any, result: any) => {
      if (error) {
        return reject(error)
      }

      if (result.length === 0) {
        return reject(new Error('Portfolio Not Found'))
      }
      const getUpdatedValue = (newValue: any, existingValue: any) => {
        return newValue !== undefined && newValue !== '' ? newValue : existingValue
      }
      const existingValue = result[0]
      const updatedPortfolio = {
        location: getUpdatedValue(portfolioData.location, existingValue.location),
        area: getUpdatedValue(portfolioData.area, existingValue.area),
        year: getUpdatedValue(portfolioData.year, existingValue.year),
        cover: getUpdatedValue(portfolioData.cover, existingValue.cover),
        highlight: getUpdatedValue(portfolioData.highlight, existingValue.highlight),
        copy_1: getUpdatedValue(portfolioData.copy_1, existingValue.copy_1),
        copy_2: getUpdatedValue(portfolioData.copy_2, existingValue.copy_2),
        copy_3: getUpdatedValue(portfolioData.copy_3, existingValue.copy_3),
        copy_4: getUpdatedValue(portfolioData.copy_4, existingValue.copy_4),
        copy_5: getUpdatedValue(portfolioData.copy_5, existingValue.copy_5),
        copy_6: getUpdatedValue(portfolioData.copy_6, existingValue.copy_6),
        image_1: getUpdatedValue(portfolioData.image_1, existingValue.image_1),
        image_2: getUpdatedValue(portfolioData.image_2, existingValue.image_2),
        image_3: getUpdatedValue(portfolioData.image_3, existingValue.image_3),
        image_4: getUpdatedValue(portfolioData.image_4, existingValue.image_4),
        image_5: getUpdatedValue(portfolioData.image_5, existingValue.image_5),
        image_6: getUpdatedValue(portfolioData.image_6, existingValue.image_6),
        image_7: getUpdatedValue(portfolioData.image_7, existingValue.image_7),
        image_8: getUpdatedValue(portfolioData.image_8, existingValue.image_8),
        image_9: getUpdatedValue(portfolioData.image_9, existingValue.image_9),
        image_10: getUpdatedValue(portfolioData.image_10, existingValue.image_10),
        image_11: getUpdatedValue(portfolioData.image_11, existingValue.image_11),
        image_12: getUpdatedValue(portfolioData.image_12, existingValue.image_12),
        category_1_id: getUpdatedValue(portfolioData.category_1_id, existingValue.category_1_id),
        category_2_id: getUpdatedValue(portfolioData.category_2_id, existingValue.category_2_id),
        category_3_id: getUpdatedValue(portfolioData.category_3_id, existingValue.category_3_id),
        client_id: getUpdatedValue(portfolioData.client_id, existingValue.client_id)
      }

      const updatesql = `
        UPDATE portfolio
        SET location = ?, area = ?, year = ?, cover = ?, highlight = ?,
            copy_1 = ?, copy_2 = ?, copy_3 = ?, copy_4 = ?, copy_5 = ?, copy_6 = ?,
            image_1 = ?, image_2 = ?, image_3 = ?, image_4 = ?, image_5 = ?, image_6 = ?,
            image_7 = ?, image_8 = ?, image_9 = ?, image_10 = ?, image_11 = ?, image_12 = ?,
            category_1_id = ?, category_2_id = ?, category_3_id = ?,client_id = ?
        WHERE id = ?`

      const values = [
        updatedPortfolio.location,
        updatedPortfolio.area,
        updatedPortfolio.year,
        updatedPortfolio.cover,
        updatedPortfolio.highlight,
        updatedPortfolio.copy_1,
        updatedPortfolio.copy_2,
        updatedPortfolio.copy_3,
        updatedPortfolio.copy_4,
        updatedPortfolio.copy_5,
        updatedPortfolio.copy_6,
        updatedPortfolio.image_1,
        updatedPortfolio.image_2,
        updatedPortfolio.image_3,
        updatedPortfolio.image_4,
        updatedPortfolio.image_5,
        updatedPortfolio.image_6,
        updatedPortfolio.image_7,
        updatedPortfolio.image_8,
        updatedPortfolio.image_9,
        updatedPortfolio.image_10,
        updatedPortfolio.image_11,
        updatedPortfolio.image_12,
        updatedPortfolio.category_1_id,
        updatedPortfolio.category_2_id,
        updatedPortfolio.category_3_id,
        updatedPortfolio.client_id,
        portfolioId
      ]

      db.query(updatesql, values, (error: any, result: any) => {
        if (error) {
          return reject(error)
        }

        resolve({
          id: portfolioId,
          ...updatedPortfolio
        } as PortfolioType)
      })
    })
  })
}

export const getallPortfolioService = async (): Promise<PortfolioType[]> => {
  const sql = `
    SELECT 
    portfolio.*,
    client.id AS client_id,
    client.client_name AS client_name,
    category1.category_name AS category_name_1,
    category2.category_name AS category_name_2,
    category3.category_name AS category_name_3
    FROM 
        portfolio
    JOIN 
        client ON portfolio.client_id = client.id
    JOIN 
        category AS category1 ON portfolio.category_1_id = category1.id
    LEFT JOIN 
        category AS category2 ON portfolio.category_2_id = category2.id
    LEFT JOIN 
        category AS category3 ON portfolio.category_3_id = category3.id
  `

  return new Promise((resolve, reject) => {
    db.query(sql, (error: any, result: PortfolioType[]) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

export const getPortfolioByIdService = async (portfolioId: number): Promise<PortfolioType> => {
  const sql = `
    SELECT 
      portfolio.*, 
      client.id AS client_id, 
      client.client_name AS client_name, 
      category1.category_name AS category_name_1, 
      category2.category_name AS category_name_2, 
      category3.category_name AS category_name_3 
    FROM 
      portfolio 
    JOIN 
      client ON portfolio.client_id = client.id 
    JOIN 
      category AS category1 ON portfolio.category_1_id = category1.id 
    LEFT JOIN 
      category AS category2 ON portfolio.category_2_id = category2.id 
    LEFT JOIN 
      category AS category3 ON portfolio.category_3_id = category3.id 
    WHERE 
      portfolio.id = ?`

  return new Promise((resolve, reject) => {
    db.query(sql, [portfolioId], (error: any, result: any) => {
      if (error) {
        reject(error)
      } else {
        resolve(result[0])
      }
    })
  })
}

export const deletePortfolioByIdService = async (portfolioId: number): Promise<void> => {
  const sql = 'DELETE FROM portfolio WHERE id = ?'

  return new Promise((resolve, reject) => {
    db.query(sql, [portfolioId], (error: any, result: any) => {
      if (error) {
        console.error('Error Deleting Portfolio: ', error)
        return reject(error)
      }

      if (result.affectedRows === 0) {
        return reject(new Error('Portfolio Not Found'))
      }

      resolve()
    })
  })
}

export const deleteAllPortfoliosService = async (): Promise<void> => {
  const sql = 'DELETE FROM portfolio'

  return new Promise((resolve, reject) => {
    db.query(sql, (error: any, result: any) => {
      if (error) {
        console.error('Error Deleting Portfolios: ', error)
        return reject(error)
      }
      const resetAutoIncrement = 'ALTER TABLE portfolio AUTO_INCREMENT = 1'
      db.query(resetAutoIncrement, (error: any) => {
        if (error) {
          console.error('Error resetting auto-increment counter: ', error)
          return reject(error)
        }

        resolve()
      })
    })
  })
}
