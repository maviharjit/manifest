/* eslint-env mocha */
const { expect } = require('chai')
const testManifest = JSON.stringify(require('./mocks/manifest.test.json'))
const { validateSchema } = require('../src/validate-schema.js')

describe('Validate Manifest Schema', function () {
  let manifest

  beforeEach(function () {
    manifest = JSON.parse(testManifest)
  })

  it('should return empty array for valid schema', function () {
    const result = validateSchema(manifest)
    expect(result).to.deep.equal([])
  })

  it('should return an error if manifest has missing fields', function () {
    delete manifest['manifest']['name']
    const result = validateSchema(manifest)
    expect(result).to.deep.equal([{
      'manifest.name': "schema is invalid. error={'path':'manifest.name'," +
        "'keyword':'required'}"
    }])
  })

  it('should return an error if manifest has extraneous fields', function () {
    manifest['manifest']['InvalidField'] = 'This is an invalid field'
    const result = validateSchema(manifest)
    expect(result).to.deep.equal([{
      'manifest': "schema is invalid. error={'additionalProperties':" +
        "'InvalidField','path':'manifest','keyword':'additionalProperties'}"
    }])
  })

  it('should return an error if the manifest has multiple extraneous fields', function () {
    manifest['manifest']['InvalidField'] = 'This is an invalid field'
    manifest['manifest']['InvalidField2'] = 'This is another invalid field'
    const result = validateSchema(manifest)
    expect(result).to.deep.equal([{
      'manifest': "schema is invalid. error={'additionalProperties':" +
        "'InvalidField','path':'manifest','keyword':'additionalProperties'}"},
    {'manifest': "schema is invalid. error={'additionalProperties':" +
          "'InvalidField2','path':'manifest','keyword':'additionalProperties'}"
    }])
  })

  it('should return an error if manifest has fields with incorrect types', function () {
    manifest['manifest']['name'] = 5
    const result = validateSchema(manifest)
    expect(result).to.deep.equal([{
      'manifest.name': "schema is invalid. error={'path':'manifest.name'," +
      "'keyword':'type'}"
    }])
  })
})
