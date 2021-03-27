
const tape = require('tape')
const lookupCSV = require('../index.js')

const lookupTable = lookupCSV('/test/data.csv', ['sound'])

tape('Testing CSV lookup', (t) => {
  t.deepEqual(
    lookupTable.getAll('moo-moo'),
    [{ animal: 'cow', sound: 'moo-moo' }, { animal: 'swiss cow', sound: 'moo-moo' }],
    'Lookup successful'
  )
  t.end()
})
