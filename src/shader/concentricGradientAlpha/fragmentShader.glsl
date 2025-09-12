
varying vec2 vUv;

uniform bool darkMode;

void main() {
    float mask = 1.0;
    mask = min(mask, max(abs(vUv.x - 0.5) * 2.0, abs(vUv.y - 0.5) * 2.0));

    float alpha = smoothstep(0.6, 0.1, mask);

    gl_FragColor.rgba = vec4(vec3(0.0), alpha);
}
