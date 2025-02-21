
varying vec2 vUv;

uniform bool darkMode;

void main() {
    float alpha = smoothstep(1.0, 0.25, length(vUv - 0.5) * 2.0);

    float brightness = 0.95;
    if (darkMode) {
        brightness = 0.05;
    }

    gl_FragColor.rgba = vec4(vec3(brightness), alpha);
}
