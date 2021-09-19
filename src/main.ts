import dotenv from 'dotenv'
import klaw from 'klaw'
import path from 'path'
import { promises as fs } from 'fs'
import * as Eta from 'eta'
import mkdirp from 'mkdirp'

function getData (options) {
  const envPath = options.envPath
    ? path.resolve(options.envPath)
    : path.resolve(process.cwd(), '.env')

  dotenv.config({
    path: envPath
  })

  return {
    env: process.env
  }
}

export async function renderFile (input: string, options) {
  const data = getData(options)
  return await Eta.renderFile(input, data, { useWith: true })
}

export async function renderFileToDirectory (input: string, output: string, options) {
  console.log('todo')
  const data = getData(options)

}

export async function renderFileToFile (input: string, output: string, options) {
  console.log('todo')
  const data = getData(options)

}

export async function renderDirectoryToDirectory (input: string, output: string, options) {
  const inputDir = path.resolve(input)
  const outputDir =  path.resolve(output)

  try {
    mkdirp.sync(outputDir)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }

  const data = getData(options)

  klaw(inputDir)
  .on ('data', async (item) => {
    const oldPath = item.path
    const newPath = item.path.replace(inputDir, outputDir)
    if (!item.stats.isDirectory()) {
      let content: string | void = await Eta.renderFile(oldPath, data, { useWith: true })
      if (!content) content = ''
      await fs.writeFile(newPath, content)
    }
    try {
      await fs.mkdir(newPath)
    } catch (err) {
      if (err.code !== 'EEXIST') throw (err)
    }
  })
  .on ('end', () => {})

  return true
}