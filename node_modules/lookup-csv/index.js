#!/usr/bin/env node

const fs = require('fs')
const HashArray = require('hasharray')
const Treeize = require('treeize')

/**
   * Build a JSON hasharray from a CSV file for fast lookups in memory
   * Uses https://www.npmjs.com/package/treeize to convert every row of the CSV to a JSON tree
   * Uses https://www.npmjs.com/package/hasharray to build a fast lookup array
   * @param {string} filePath - Path to a CSV file to lookup
   * @param {Array} keyfields - Column names to use for lookup
   * @param {Object} options - Options
   * @param {Object} options.treeize - Options to pass to the treeize module
   * @return {Object} A hasharray object
   */

function lookupCSV (filePath, keyfields, options = {
  enumerateKeys : true,
  treeize : {
    input: {
      detectCollections: false, // when true, plural path segments become collections
      delimiter: '.'
    },
    output: {
      uniformRows: false
    }
  }
}) {
  // Open a CSV stream of the matching spreadsheet
  const csvStream = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)

  // Split CSV into array of strings and convert into a json object array
  const csvsplit = csvStream.map(line => line.split(','))
  const headers = csvsplit[0]

  const jsonArrObj = csvsplit.splice(1).map((line) => {
    const jsonObj = {}

    // Convert enumerable object keys into arrays
    if (options.enumerateKeys){
      for (let i = 0; i < headers.length; i += 1) {
        const key = headers[i].split('.')
        if (!Number.isNaN(parseInt(key.slice(-1)[0], 10))) {
          if (!parseInt(key.slice(-1)[0], 10)) {
            // Initialize an array for the tags
            jsonObj[key.slice(0, -1).join('.')] = []
          }
          jsonObj[key.slice(0, -1).join('.')].push(line[i].trim())
        } else {
          jsonObj[headers[i]] = line[i].trim()
        }
      }
    }
    
    return jsonObj
  })

  //  Hash the CSV array json tree with given key
  const treeize = new Treeize()
  const jsonTree = treeize.setOptions(options.treeize).grow(jsonArrObj).getData()
  const hashArray = new HashArray(keyfields).addAll(jsonTree)

  return hashArray
}

module.exports = lookupCSV
