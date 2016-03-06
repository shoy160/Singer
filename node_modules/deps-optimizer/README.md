# deps-optimizer

optimize dependency object

## examples

### input:

``` javascript
  var input = {
    a:['b','c'],
    b:['e'],
    e:['c']
  };
  console.log(require('deps-optimizer').optimize(input));
```

### output

 ``` javascript
  {
    a:['b'],
    b:['e'],
    e:['c']
  }
```