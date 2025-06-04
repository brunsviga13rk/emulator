
varying vec2 vUv;

uniform bool darkMode;

void main() {
    float alpha = smoothstep(0.8, 0.1, length(vUv - 0.5) * 2.0);

    gl_FragColor.rgba = vec4(vec3(0.0), alpha);
}
