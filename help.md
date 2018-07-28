##### Special Regex Characters
* `.`	- matches any character
* `\d`	- matches digits 0-9
* `\D`	- matches any character but 0-9
* `\s`	- matches whitespace characters
* `\S`	- matches any character but whitespace
* `\w`	- matches A-Z, a-z, 0-9, and _
* `\W`	- matches any character but A-Z, a-z, 0-9, and _
* `\t`	- matches a tab character
* `\n`	- matches a newline character
  * This can be used in the template to print a newline

##### Character Sets
* `[ab]`	- matches any one character within the brackets
* `[^ab]`	- matches any character except those in the brackets

##### Alternation
* `a|b`	- matches the expression on the right or the expression on the left

##### Boundaries
* `^` - matches the beginning of input
  * Also matches the beginning of the line when 'Multiline' is checked
* `$` - matches the end of input
  * Also matches the end of the line before the line break character when 'Multiline' is checked
* `\b`	- matches word boundaries
* `\B`	- matches non-word boundaries

##### Grouping and Back References
* `(a)`	- matches the expression within and remembers the match
* `\n`	- matches the *n*th parenthesized expression, where *n* is a positive integer
  * This can be used in the template to print the *n*th parenthesized expression
*  `(?:a)` - matches the expression within and doesn't remember the match

##### Quantifiers
* `a*`	- matches the expression 0 or more times
* `a+`	- matches the expression 1 or more times
* `a?`	- matches the expression 0 or 1 times
* `a{n}` - matches the expression *n* times
* `a{n,}`- matches the expression *n* or more times
* `a{n,m}` - matches the expression *n* to *m* times

For details, examples, and advanced concepts, visit [this documentation.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_meaning_in_regular_expressions)

Note: *a* and *b* in the examples represent any expression
