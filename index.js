#!/usr/bin/env node

import { count } from './utils.js'
import fs from 'node:fs'
import './src/command.js'

const note = process.argv[2]
const newNote = {
	note: note,
	id: new Date()
}

console.log('hello')
console.log(newNote)
console.log(count(1))

