import ValidationModule from '../../core/ValidationModule';

import { validationErrorCodes, validationHTMLCode } from '../../util/ValidationConstants';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { getBBox } from 'diagram-js/lib/util/Elements';


export default class CrossingFlowValidation extends ValidationModule {
    
    constructor(elementRegistry, translate) {
        super()
        this.name = translate('Crossing Flow');

        this._elementRegistry = elementRegistry;
        this.currentBBoxes = [];
        this.currentOverlappingBoxes = [];
        this._translate = translate;
    }

    validate() {
        this.currentBBoxes = [];
        this.currentOverlappingBoxes = [];

        let sequenceFlows = this._elementRegistry.filter(element => {
            return is(element, 'bpmn:SequenceFlow') && element.type !== "label";
        });

        sequenceFlows.forEach((flow) => {
            this.currentBBoxes.push({
                flow: flow,
                box: getBBox(flow)
            });
        });

        this.currentBBoxes.forEach((box) => {
            this._checkForOverlappingBoxes(box);
        });

        this.currentOverlappingBoxes.forEach((overlappingBoxes) => {
            this._checkForOverlappingFlows(overlappingBoxes);
        });

        return this.errors;;
    }

    _checkForOverlappingBoxes(startingBox) {
        let index = this.currentBBoxes.indexOf(startingBox);
        index++;

        for (index; index < this.currentBBoxes.length; index++) {
            let comparingBox = this.currentBBoxes[index];

            let baseBox = startingBox.box;
            let box = comparingBox.box;

            let boxAPoints = {
                leftUpperCorner: {
                    x: baseBox.x,
                    y: baseBox.y
                },
                rightBottomCorner: {
                    x: (baseBox.x + baseBox.width),
                    y: (baseBox.y + baseBox.height)
                }
            },
                boxBPoints = {
                    leftUpperCorner: {
                        x: box.x,
                        y: box.y
                    },
                    rightBottomCorner: {
                        x: (box.x + box.width),
                        y: (box.y + box.height)
                    }
                };

            if (!(((boxAPoints.leftUpperCorner.x > boxBPoints.rightBottomCorner.x || boxBPoints.leftUpperCorner.x > boxAPoints.rightBottomCorner.x)) ||
                (boxAPoints.leftUpperCorner.y > boxBPoints.rightBottomCorner.y || boxBPoints.leftUpperCorner.y > boxAPoints.rightBottomCorner.y))) {

                this.currentOverlappingBoxes.push({
                    flowA: startingBox.flow,
                    flowB: comparingBox.flow
                });
            }
        }
    }

    _checkForOverlappingFlows(overlappingBoxes) {
        let baseSequenceflow = overlappingBoxes.flowA,
            comparingSequenceflow = overlappingBoxes.flowB;

        let waypointIdxA = 0;

        for (waypointIdxA; (waypointIdxA + 1) < baseSequenceflow.waypoints.length; waypointIdxA++) {
            let waypointIdxB = 0;
            let lineA = {
                start: {
                    x: baseSequenceflow.waypoints[waypointIdxA].x,
                    y: baseSequenceflow.waypoints[waypointIdxA].y
                },
                end: {
                    x: baseSequenceflow.waypoints[waypointIdxA + 1].x,
                    y: baseSequenceflow.waypoints[waypointIdxA + 1].y
                }
            };

            for (waypointIdxB; (waypointIdxB + 1) < comparingSequenceflow.waypoints.length; waypointIdxB++) {
                let lineB = {
                    start: {
                        x: comparingSequenceflow.waypoints[waypointIdxB].x,
                        y: comparingSequenceflow.waypoints[waypointIdxB].y
                    },
                    end: {
                        x: comparingSequenceflow.waypoints[waypointIdxB + 1].x,
                        y: comparingSequenceflow.waypoints[waypointIdxB + 1].y
                    }
                };

                let det, 
                gamma, 
                lambda;

                det = (lineA.end.x - lineA.start.x) * (lineB.end.y - lineB.start.y) - (lineB.end.x - lineB.start.x) * (lineA.end.y - lineA.start.y);

                if (det !== 0) {
                    lambda = ((lineB.end.y - lineB.start.y) * (lineB.end.x - lineA.start.x)
                        + (lineB.start.x - lineB.end.x) * (lineB.end.y - lineA.start.y)) / det;

                    gamma = ((lineA.start.y - lineA.end.y) * (lineB.end.x - lineA.start.x)
                        + (lineA.end.x - lineA.start.x) * (lineB.end.y - lineA.start.y)) / det;

                    if ((0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)) {
                        let alreadyTracked = false;
                        this.errors.forEach(alreadyError => {
                            alreadyTracked = alreadyError.element.id === baseSequenceflow.id
                        });
                        if (!alreadyTracked) {
                            this.addValidationError({
                                element: baseSequenceflow,
                                errorType: validationErrorCodes.CROSSING_FLOWS,
                                notification: this._translate('Crossing sequence flows on element:'),
                                html: validationHTMLCode(this._translate).CROSSING_FLOWS_HTML
                            });
                        }
                    }
                }
            }
        }
    }
}
CrossingFlowValidation.$inject = ['elementRegistry', 'translate'];