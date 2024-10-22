import db from '../utils/connectDB'
import CategoryType from '../type/category.type'

export const getallCategoryService = async (): Promise<CategoryType[]> => {
  const sql = 'SELECT * FROM category'

  return new Promise((resolve, reject) => {
    db.query(sql, (error: any, result: CategoryType[]) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

export const postCategoryService = async (category_name: string): Promise<CategoryType> => {
  const sql = 'INSERT INTO category (category_name) VALUES (?)'
  const values = [category_name]

  return new Promise((resolve, reject) => {
    db.query(sql, values, (error: any, result: any) => {
      if (error) {
        reject(error)
      } else {
        resolve({
          id: result.insertId,
          category_name
        } as CategoryType)
      }
    })
  })
}

export const deleteAllCategoryService = async (): Promise<void> => {
  const sql = 'DELETE FROM category'

  return new Promise((resolve, reject) => {
    db.query(sql, (error: any, result: any) => {
      if (error) {
        console.error('Error Deleting Categories: ', error)
        return reject(error)
      }

      const resetAutoIncrement = 'ALTER TABLE category AUTO_INCREMENT = 1'
      db.query(resetAutoIncrement, (error: any, result: any) => {
        if (error) {
          console.error('Error resetting auto-increment counter: ', error)
          return reject(error)
        }

        resolve()
      })
    })
  })
}

export const getCategoryByIdService = async (categoryId: number): Promise<CategoryType> => {
  const sql = 'SELECT * FROM category WHERE id = ?'

  return new Promise((resolve, reject) => {
    db.query(sql, [categoryId], (error: any, result: any) => {
      if (error) {
        console.error('Error Fetching Category: ', error)
        return reject(error)
      }

      if (result.length === 0) {
        return reject(new Error('Category Not Found'))
      }

      resolve(result[0])
    })
  })
}

export const deleteCategoryByIdService = async (categoryId: number): Promise<void> => {
  const sql = 'DELETE FROM category WHERE id = ?'

  return new Promise((resolve, reject) => {
    db.query(sql, [categoryId], (error: any, result: any) => {
      if (error) {
        console.error('Error Deleting Category: ', error)
        return reject(error)
      }

      if (result.affectedRows === 0) {
        return reject(new Error('Category Not Found'))
      }

      resolve()
    })
  })
}

export const updateCategoryByIdService = async (
  categoryId: number,
  categoryData: Partial<CategoryType>
): Promise<CategoryType> => {
  const fetchSql = 'SELECT category_name FROM category WHERE id = ?'

  return new Promise((resolve, reject) => {
    db.query(fetchSql, [categoryId], (fetchError: any, fetchResult: any) => {
      if (fetchError) {
        console.error('Error Fetching Category Details: ', fetchError)
        return reject(fetchError)
      }

      if (fetchResult.length === 0) {
        return reject(new Error('Category Not Found'))
      }

      const existingValues = fetchResult[0]
      const updateName =
        categoryData.category_name !== undefined ? categoryData.category_name : existingValues.category_name

      const updateSql = 'UPDATE category SET category_name = ? WHERE id = ?'
      const values = [updateName, categoryId]

      db.query(updateSql, values, (error: any, result: any) => {
        if (error) {
          console.error('Error Updating Category: ', error)
          return reject(error)
        }

        resolve({
          id: categoryId,
          category_name: updateName
        } as CategoryType)
      })
    })
  })
}
