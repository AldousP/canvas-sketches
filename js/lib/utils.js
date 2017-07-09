'use strict'

function hashForInt(integer) {
  integer = integer * 10 + 100;
  return '' +
	  Math.floor(
		  Math.abs(integer - integer / 2) +
		  Math.abs(integer - integer / 3) +
		  Math.abs(integer - integer / 4) +
		  Math.abs(integer - integer / 5)
	  )
}
