const prefix = 'guidelineValidation';

const validationErrorCodes = Object.freeze({
    LABELING: 'LABELING',
    START_AND_END_EVENT: 'START_AND_END_EVENT',
    MULTIPLE_GATEWAY_USE: 'MULTIPLE_GATEWAY_USE',
    MULTIPLE_FLOW_ON_ELEMENT: 'MULTIPLE_FLOW_ON_ELEMENT',
    SYMMETRIC_MODELING: 'SYMMETRIC_MODELING',
    UNNECESSARY_GATEWAY: 'UNNECESSARY_GATEWAY',
    CROSSING_FLOWS: 'CROSSING_FLOWS'
});

const validationHTMLCode = translate => Object.freeze({
    MISSING_LABEL_HTML: `<span class="sgv-header">${translate('Labeling BPMN Elements')}</span>` +
        `<p>${translate('The clarity and meaning of a process is often as good as how well-chosen it’s labels are.')}</p>` +
        '<img class="sgv-hint" alt="no label hint" src="hints/labeling.gif"></img></div></div>',
    MULTIPLE_GATEWAY_USE_HTML: `<span class="sgv-header">${translate('Multiple Gateway Use')}</span>` +
        `<p>${translate('In general, avoid mixing up the split and join semantics of gateways by explicitly showing two separate symbols.')}</p>` +
        '<img class="sgv-hint" alt="multiple gateway hint" src="hints/multiple_gateway.gif"></img></div></div>',
    MULTIPLE_INCOMING_HTML: `<span class="sgv-header">${translate('Multiple Flows on Element')}</span>` +
        `<p>${translate('Always model joining the process flow by explicitly showing the gateway symbol.')}</p>` +
        '<img class="sgv-hint" alt="multiple flow hint" src="hints/multiple_incoming.gif"></img></div></div>',
    MULTIPLE_OUTGOING_HTML: `<span class="sgv-header">${translate('Multiple Flows on Element')}</span>` +
        `<p>${translate('Always model splitting the process flow by explicitly showing the gateway symbol.')}</p>` +
        '<img class="sgv-hint" alt="multiple flow hint" src="hints/multiple_outgoing.gif"></img></div></div>',
    SYMMETRIC_MODELING_HTML: `<span class="sgv-header">${translate('Symmetric modelling')}</span>` +
        `<p>${translate('Try to model symmetrically. Identify splitting and joining gateways "belonging" to each other and form easily recognizable visual, eventually nested, blocks with those gateways.')}</p>` +
        '<img class="sgv-hint" alt="symmetric modelling hint" src="hints/symmetric.gif"></img></div></div>',
    UNNECESSARY_GATEWAY_HTML: `<span class="sgv-header">${translate('Unnecessary use of gateway')}</span>` +
        `<p>${translate('Gateways with just one incoming and one outgoing sequenceflow are unnecessary to model')}</p>` +
        '<img class="sgv-hint" alt="unnecessary gateway hint" src="hints/unnecessary.gif"></img></div></div>',
    CROSSING_FLOWS_HTML: `<span class="sgv-header">${translate('Crossing sequence flows')}</span>` +
        `<p>${translate('Try to model a clear and simple to read sequenceflow.')}</p>` +
        '<img class="sgv-hint" alt="unnecessary gateway hint" src="hints/crossing.gif"></img></div></div>'
});

const BASIC_WARN_HTML = 
    '<div class="sgv-warn-container">' +
        '<img class="sgv-warn-icon" alt="Stylguide-Warn-Logo" src="icon/warning.svg"></img>' +
    '<div class="sgv-tooltip-content">'

const validationEvents = Object.freeze({
    TOGGLE_VALIDATION: prefix + 'toggleMode',
    STOP_VALIDATION: prefix + 'stopMode',
    START_VALIDATION: prefix + 'startMode',
    FINISH_VALIDATION: prefix + 'finishMode',
    MODULES_LOADED: prefix + 'modulesLoaded'
})

module.exports.BASIC_WARN_HTML = BASIC_WARN_HTML;
module.exports.validationErrorCodes = validationErrorCodes;
module.exports.validationEvents = validationEvents;
module.exports.validationHTMLCode = validationHTMLCode;