# -part3-phonebook-backend
Phonebook backend

## deploy
```bash
fly deploy
fly apps list
fly open
fly apps destroy app-name

```

## error
problem
ESLint - 'process' is not defined
solution
change "browser": true instead of "node": true.

problem
close eslint for some code
solution
```node
/* eslint-disable */ <-- Before function

function render(){
   // do stuff
   }

/* eslint-enable */  <-- After function
```

