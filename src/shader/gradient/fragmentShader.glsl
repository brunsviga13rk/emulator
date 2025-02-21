
// UV coordinates of the mesh
varying vec2 vUv;

uniform bool darkMode;

void main() {
    // Linear gradient mapped into the range [0.5; 1.0].
    float gradient = vUv.y * 0.5 + 0.5;

    if (darkMode) {
        gradient *= 0.025;
    }

    // Return desaturated opaque color gradient.
    gl_FragColor.rgba = vec4(vec3(gradient), 1.0);
}
