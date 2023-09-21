uniform sampler2D u_image;
uniform sampler2D u_color_ramp;
varying vec2 v_pos;

uniform vec2 u_latrange;
uniform vec4 u_accent;

void main() {
    vec4 pixel = texture2D(u_image, v_pos);

    vec2 deriv = ((pixel.rg * 2.0) - 1.0);

    // We divide the slope by a scale factor based on the cosin of the pixel's approximate latitude
    // to account for mercator projection distortion. see #4807 for details
    float scaleFactor = cos(radians((u_latrange[0] - u_latrange[1]) * (1.0 - v_pos.y) + u_latrange[1]));
    // We also multiply the slope by an arbitrary z-factor of 1.25
    float slope = atan(1.25 * length(deriv) / scaleFactor);
    float aspect = deriv.x != 0.0 ? atan(deriv.y, -deriv.x) : PI / 2.0 * (deriv.y > 0.0 ? 1.0 : -1.0);
    
    float maxSlope = 60.0 * PI / 180.0;
    vec4 color = texture2D(u_color_ramp, vec2(slope / maxSlope, 0.5));
    gl_FragColor = color;

#ifdef LIGHTING_3D_MODE
    gl_FragColor = apply_lighting(gl_FragColor);
#endif
#ifdef FOG
    gl_FragColor = fog_dither(fog_apply_premultiplied(gl_FragColor, v_fog_pos));
#endif

#ifdef OVERDRAW_INSPECTOR
    gl_FragColor = vec4(1.0);
#endif
}
