#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D u_image;
varying vec2 v_pos;
uniform vec2 u_dimension;
uniform float u_zoom;
uniform vec4 u_unpack;

float getElevation(vec2 coord) {
#ifdef TERRAIN_DEM_FLOAT_FORMAT
    return texture2D(u_image, coord).a / 4.0;
#else
    // Convert encoded elevation value to meters
    vec4 data = texture2D(u_image, coord) * 255.0;
    data.a = -1.0;
    return dot(data, u_unpack) / 4.0;
#endif
}

void main() {
    vec2 epsilon = 1.0 / u_dimension;

    // queried pixels:
    // +-----------+
    // |   |   |   |
    // | a | b | c |
    // |   |   |   |
    // +-----------+
    // |   |   |   |
    // | d |   | e |
    // |   |   |   |
    // +-----------+
    // |   |   |   |
    // | f | g | h |
    // |   |   |   |
    // +-----------+

    float a = getElevation(v_pos + vec2(-epsilon.x, -epsilon.y));
    float b = getElevation(v_pos + vec2(0, -epsilon.y));
    float c = getElevation(v_pos + vec2(epsilon.x, -epsilon.y));
    float d = getElevation(v_pos + vec2(-epsilon.x, 0));
    float e = getElevation(v_pos + vec2(epsilon.x, 0));
    float f = getElevation(v_pos + vec2(-epsilon.x, epsilon.y));
    float g = getElevation(v_pos + vec2(0, epsilon.y));
    float h = getElevation(v_pos + vec2(epsilon.x, epsilon.y));

    // Here we divide the x and y slopes by 8 * pixel size
    // where pixel size (aka meters/pixel) is:
    // circumference of the world / (pixels per tile * number of tiles)
    // which is equivalent to: 8 * 40075016.6855785 / (512 * pow(2, u_zoom))
    // which can be reduced to: pow(2, 19.25619978527 - u_zoom).

   // We do not exaggerate the slope angle ever

    vec2 deriv = vec2(
        (c + e + e + h) - (a + d + d + f),
        (f + g + g + h) - (a + b + b + c)
    ) / pow(2.0, 19.2562 - u_zoom);

    gl_FragColor = clamp(vec4(
        deriv.x / 2.0 + 0.5,
        deriv.y / 2.0 + 0.5,
        1.0,
        1.0), 0.0, 1.0);

#ifdef OVERDRAW_INSPECTOR
    gl_FragColor = vec4(1.0);
#endif
}
