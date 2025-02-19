// @flow

import styleSpec from '../style-spec/reference/latest.js';
import {Evented} from '../util/evented.js';
import {Properties, Transitionable, Transitioning, PossiblyEvaluated, DataConstantProperty} from './properties.js';

import type EvaluationParameters from './evaluation_parameters.js';
import type {TransitionParameters} from './properties.js';
import type {TerrainSpecification} from '../style-spec/types.js';

type Props = {|
    "source": DataConstantProperty<string>,
    "exaggeration": DataConstantProperty<number>,
|};

export const DrapeRenderMode = {
    deferred: 0,
    elevated: 1
};

const properties: Properties<Props> = new Properties({
    "source": new DataConstantProperty(styleSpec.terrain.source),
    "exaggeration": new DataConstantProperty(styleSpec.terrain.exaggeration),
});

class Terrain extends Evented {
    _transitionable: Transitionable<Props>;
    _transitioning: Transitioning<Props>;
    properties: PossiblyEvaluated<Props>;
    drapeRenderMode: number;

    constructor(terrainOptions: TerrainSpecification, drapeRenderMode: number) {
        super();
        this._transitionable = new Transitionable(properties);
        this.set(terrainOptions);
        this._transitioning = this._transitionable.untransitioned();
        this.drapeRenderMode = drapeRenderMode;
    }

    get(): TerrainSpecification {
        return (this._transitionable.serialize(): any);
    }

    set(terrain: TerrainSpecification) {
        this._transitionable.setTransitionOrValue<TerrainSpecification>(terrain);
    }

    updateTransitions(parameters: TransitionParameters) {
        this._transitioning = this._transitionable.transitioned(parameters, this._transitioning);
    }

    hasTransition(): boolean {
        return this._transitioning.hasTransition();
    }

    recalculate(parameters: EvaluationParameters) {
        this.properties = this._transitioning.possiblyEvaluate(parameters);
    }
}

export default Terrain;
