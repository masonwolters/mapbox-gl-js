// @flow

import StyleLayer from '../style_layer.js';

import properties from './slope_style_layer_properties.js';
import {Transitionable, Transitioning, PossiblyEvaluated} from '../properties.js';

import type {PaintProps} from './slope_style_layer_properties.js';
import type {LayerSpecification} from '../../style-spec/types.js';

class SlopeStyleLayer extends StyleLayer {
    _transitionablePaint: Transitionable<PaintProps>;
    _transitioningPaint: Transitioning<PaintProps>;
    paint: PossiblyEvaluated<PaintProps>;

    constructor(layer: LayerSpecification) {
        super(layer, properties);
    }

    hasOffscreenPass(): boolean {
        return this.paint.get('hillshade-exaggeration') !== 0 && this.visibility !== 'none';
    }

    getProgramIds(): Array<string> {
        return ['slope', 'slopePrepare'];
    }
}

export default SlopeStyleLayer;
