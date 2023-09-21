// @flow

import StyleLayer from '../style_layer.js';

import properties from './slope_style_layer_properties.js';
import {Transitionable, Transitioning, PossiblyEvaluated} from '../properties.js';
import {RGBAImage} from "../../util/image.js";
import {renderColorRamp} from '../../util/color_ramp.js';

import type {PaintProps} from './slope_style_layer_properties.js';
import type {LayerSpecification} from '../../style-spec/types.js';
import type Texture from '../../render/texture.js';

class SlopeStyleLayer extends StyleLayer {
    colorRamp: RGBAImage;
    colorRampTexture: ?Texture;

    _transitionablePaint: Transitionable<PaintProps>;
    _transitioningPaint: Transitioning<PaintProps>;
    paint: PossiblyEvaluated<PaintProps>;

    constructor(layer: LayerSpecification) {
        super(layer, properties);

        this._updateColorRamp();
    }

    _updateColorRamp() {
        const expression = this._transitionablePaint._values['slope-color-ramp'].value.expression;
        this.colorRamp = renderColorRamp({
            expression,
            evaluationKey: 'lineProgress',
            image: this.colorRamp
        });
        this.colorRampTexture = null;
    }

    hasOffscreenPass(): boolean {
        return this.visibility !== 'none';
    }

    getProgramIds(): Array<string> {
        return ['slope', 'slopePrepare'];
    }
}

export default SlopeStyleLayer;
