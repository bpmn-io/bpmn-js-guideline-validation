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

const validationHTMLCode = Object.freeze({
    BASIC_WARN_HTML: '<div class="sgv-warn-container">' +
        '<img class="sgv-warn-icon" alt="Stylguide-Warn-Logo" src="icon/warning.svg"></img>' +
        '<div class="sgv-tooltip-content">',
    MISSING_LABEL_HTML: '<span class="sgv-header">Labeling BPMN Elements</span>' +
        '<p>The clarity and meaning of a process is often as good as how well-chosen it’s labels are.</p>' +
        '<img class="sgv-hint" alt="no label hint" src="hints/labeling.gif"></img></div></div>',
    MULTIPLE_GATEWAY_USE_HTML: '<span class="sgv-header">Multiple Gateway Use</span>' +
        '<p>In general, avoid mixing up the split and join semantics of gateways by explicitly showing two separate symbols.</p>' +
        '<img class="sgv-hint" alt="multiple gateway hint" src="hints/multiple_gateway.gif"></img></div></div>',
    MULTIPLE_INCOMING_HTML: '<span class="sgv-header">Multiple Flows on Element</span>' +
        '<p>Always model joining the process flow by explicitly showing the gateway symbol.</p>' +
        '<img class="sgv-hint" alt="multiple flow hint" src="hints/multiple_incoming.gif"></img></div></div>',
    MULTIPLE_OUTGOING_HTML: '<span class="sgv-header">Multiple Flows on Element</span>' +
        '<p>Always model splitting the process flow by explicitly showing the gateway symbol.</p>' +
        '<img class="sgv-hint" alt="multiple flow hint" src="hints/multiple_outgoing.gif"></img></div></div>',
    SYMMETRIC_MODELING_HTML: '<span class="sgv-header">Symmetric modelling</span>' +
        '<p>Try to model symmetrically. Identify splitting and joining gateways "belonging" to each other ' + 
        'and form easily recognizable visual, eventually nested, blocks with those gateways.</p>' +
        '<img class="sgv-hint" alt="symmetric modelling hint" src="hints/symmetric.gif"></img></div></div>',
    UNNECESSARY_GATEWAY_HTML: '<span class="sgv-header">Unnecessary use of gateway</span>' +
        '<p>Gateways with just one incoming and one outgoing sequenceflow are unnecessary to model</p>' +
        '<img class="sgv-hint" alt="unnecessary gateway hint" src="hints/unnecessary.gif"></img></div></div>',
    CROSSING_FLOWS_HTML: '<span class="sgv-header">Crossing sequence flows</span>' +
        '<p>Try to model a clear and simple to read sequenceflow.</p>' +
        '<img class="sgv-hint" alt="unnecessary gateway hint" src="hints/crossing.gif"></img></div></div>'
});

const validationEvents = Object.freeze({
    TOGGLE_VALIDATION: prefix + 'toggleMode',
    STOP_VALIDATION: prefix + 'stopMode',
    START_VALIDATION: prefix + 'startMode',
    FINISH_VALIDATION: prefix + 'finishMode',
    MODULES_LOADED: prefix + 'modulesLoaded'
})

module.exports.validationErrorCodes = validationErrorCodes;
module.exports.validationHTMLCode = validationHTMLCode;
module.exports.validationEvents = validationEvents;