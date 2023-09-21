// This file is generated. Edit build/generate-style-code.js, then run `yarn run codegen`.
// @flow
/* eslint-disable */

import styleSpec from '../../style-spec/reference/latest.js';

import {
    Properties,
    DataConstantProperty,
    DataDrivenProperty,
    ColorRampProperty
} from '../properties.js';

import type Color from '../../style-spec/util/color.js';

import type Formatted from '../../style-spec/expression/types/formatted.js';

import type ResolvedImage from '../../style-spec/expression/types/resolved_image.js';


export type PaintProps = {|
    "slope-color-ramp": ColorRampProperty,
    "slope-opacity": DataConstantProperty<number>,
|};

const paint: Properties<PaintProps> = new Properties({
    "slope-color-ramp": new ColorRampProperty(styleSpec["paint_slope"]["slope-color-ramp"]),
    "slope-opacity": new DataConstantProperty(styleSpec["paint_heatmap"]["heatmap-opacity"]),
});

// Note: without adding the explicit type annotation, Flow infers weaker types
// for these objects from their use in the constructor to StyleLayer, as
// {layout?: Properties<...>, paint: Properties<...>}
export default ({ paint }: $Exact<{
  paint: Properties<PaintProps>
}>);
