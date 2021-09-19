import { Command } from 'commander'
import fs from 'fs'
import path from 'path'

import * as engine from './main'

function checkSource (path: string): boolean {
  let sourceIsDirectory: boolean
  try {
    sourceIsDirectory = fs.statSync(path).isDirectory()
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('The source file/directory does not exist')
      return
    }
  }
  return sourceIsDirectory
}

async function action (source: string, destination: string, options): Promise<void> {
  const sourcePath = path.resolve(source)
  const sourceIsDirectory = checkSource(sourcePath)
 
  const config = {
    envPath: options.env,
    overwriteExisting: options['overwrite-existing'],
    clearDestination: options['clear-destination'],
    validate: false
  }

  // If destination argument is provided
  if (destination) {
    const destinationPath = path.resolve(destination)

    let destinationIsDirectory,
      destinationExists = true
    
    try {
      destinationIsDirectory = fs.statSync(destinationPath).isDirectory()
    } catch (err) {
      if (err.code !== 'ENOENT') throw (err)
      destinationExists = false
    }
    
    if (sourceIsDirectory) {
      if (destinationExists && !destinationIsDirectory) {
        console.log('Source is a directory, but destination is an existing file')
        return
      }
      // !destinationExists || (destinationExists && destinationIsDirectory)
      return engine.renderDirectoryToDirectory(
        sourcePath,
        destinationPath,
        config
      ).then(() => {})
    }

    if (destinationExists) {
      // !sourceIsDirectory && destinationExists
      if (destinationIsDirectory) {
        // destinationIsDirectory
        return engine.renderFileToDirectory(
          sourcePath, 
          destinationPath,
          config
        ).then(() => {})
      } else {
        // !destinationIsDirectory
        return engine.renderFileToFile(
          sourcePath, 
          destinationPath,
          config
        ).then(() => {})
      }
    } else {
      // !sourceIsDirectory && !destinationExists
      return engine.renderFileToFile(
        sourcePath, 
        destinationPath,
        config
      ).then(() => {})
    }
  }
  
  // !destination
  if (sourceIsDirectory) {
    console.log('When the source is a directory, you must provide a destination path')
  }
  
  const content = await engine.renderFile(
    sourcePath, 
    config
  )
  console.log(content)
  return
}

export function run (): void {
  const program = new Command()
  program
    .version('0.0.1')
    .description('Runs the contents of an input folder through the eta templating engine to generate a new folder')
    .argument('<source>', 'source path (e.g., ./templates)')
    .argument('[destination]', 'destination path (e.g., ./build/templates)')
    .option('-e, --env <path>', 'set environment file path', './.env')
    .option('-c, --clear-dest', 'clear the destination directory', false)
    .option('-o, --overwrite-existing', 'overwrite existing files in destination directory', true)
    .action(action)    
  program.parse()
}
