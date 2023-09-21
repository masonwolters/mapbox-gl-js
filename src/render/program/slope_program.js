// @flow

import {mat4} from 'gl-matrix';

import {
    Uniform1i,
    Uniform1f,
    Uniform2f,
    UniformColor,
    UniformMatrix4f,
    Uniform4f
} from '../uniform_binding.js';
import EXTENT from '../../data/extent.js';
import MercatorCoordinate from '../../geo/mercator_coordinate.js';

import type Context from '../../gl/context.js';
import type {UniformValues} from '../uniform_binding.js';
import type Tile from '../../source/tile.js';
import type Painter from '../painter.js';
import type SlopeStyleLayer from '../../style/style_layer/slope_style_layer.js';
import type DEMData from '../../data/dem_data.js';
import type {OverscaledTileID} from '../../source/tile_id.js';

export type SlopeUniformsType = {|
    'u_matrix': UniformMatrix4f,
    'u_image': Uniform1i,
    'u_latrange': Uniform2f,
    'u_color_ramp': Uniform1i,
    'u_accent': UniformColor
|};

export type SlopePrepareUniformsType = {|
    'u_matrix': UniformMatrix4f,
    'u_image': Uniform1i,
    'u_dimension': Uniform2f,
    'u_zoom': Uniform1f,
    'u_unpack': Uniform4f
|};

const slopeUniforms = (context: Context): SlopeUniformsType => ({
    'u_matrix': new UniformMatrix4f(context),
    'u_image': new Uniform1i(context),
    'u_latrange': new Uniform2f(context),
    'u_color_ramp': new Uniform1i(context),
    'u_accent': new UniformColor(context)
});

const slopePrepareUniforms = (context: Context): SlopePrepareUniformsType => ({
    'u_matrix': new UniformMatrix4f(context),
    'u_image': new Uniform1i(context),
    'u_dimension': new Uniform2f(context),
    'u_zoom': new Uniform1f(context),
    'u_unpack': new Uniform4f(context)
});

const slopeUniformValues = (
    painter: Painter,
    tile: Tile,
    layer: SlopeStyleLayer,
    matrix: ?Float32Array
): UniformValues<SlopeUniformsType> => {
    const accent = layer.paint.get("slope-accent-color");

    const align = !painter.options.moving;
    return {
        'u_matrix': matrix ? matrix : painter.transform.calculateProjMatrix(tile.tileID.toUnwrapped(), align),
        'u_image': 0,
        'u_latrange': getTileLatRange(painter, tile.tileID),
        'u_color_ramp': 1,
        'u_accent': accent
    };
};

const slopeUniformPrepareValues = (
    tileID: OverscaledTileID, dem: DEMData
): UniformValues<SlopePrepareUniformsType> => {

    const stride = dem.stride;
    const matrix = mat4.create();
    // Flip rendering at y axis.
    mat4.ortho(matrix, 0, EXTENT, -EXTENT, 0, 0, 1);
    mat4.translate(matrix, matrix, [0, -EXTENT, 0]);

    return {
        'u_matrix': matrix,
        'u_image': 1,
        'u_dimension': [stride, stride],
        'u_zoom': tileID.overscaledZ,
        'u_unpack': dem.unpackVector
    };
};

function getTileLatRange(painter: Painter, tileID: OverscaledTileID) {
    // for scaling the magnitude of a points slope by its latitude
    const tilesAtZoom = Math.pow(2, tileID.canonical.z);
    const y = tileID.canonical.y;
    return [
        new MercatorCoordinate(0, y / tilesAtZoom).toLngLat().lat,
        new MercatorCoordinate(0, (y + 1) / tilesAtZoom).toLngLat().lat];
}

export {
    slopeUniforms,
    slopePrepareUniforms,
    slopeUniformValues,
    slopeUniformPrepareValues
};
