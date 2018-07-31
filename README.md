# bpmn-js guideline validation 

A bpmn-js extention for guideline validations.

## Installation

Install via [npm](https://www.npmjs.com/).

```
npm install bpmn-js-guideline-validation
```

Add as additional module to [bpmn-js](https://github.com/bpmn-io/bpmn-js)

### Usage

```javascript
var BpmnModeler = require('bpmn-js/lib/Modeler');
var guidelineValidation = require('bpmn-js-guideline-validation');

var modeler = new BpmnModeler({
    container: '#canvas',
    additionalModules: [
        guidelineValidation
    ],
    keyboard: { 
        bindTo: document 
    }
});
```

> For the correct style of the extension you need to copy the assets in the root directory of your `index.html` and include the `css/guideline-validation.css` to your `index.html`. Have a look at the [example](example/index.html).

## Example
Install dependencies

```
npm install
```

Run example

```
npm run dev
```

Check out `localhost:9013`


## Current Guidelines

- Crossing Sequenceflows
- Joining and Splitting Gateways
- No Labels
- No Start and End Event
- Symmetric Modelling
- Unnecessary Gateway
- Use of Parallel Gateway

> Some of the guideline validations are just working properly, if another one is already fixed. For example, you need to modell a start event for the symmetric modelling check.

## Licence
MIT