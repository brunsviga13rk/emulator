
varying vec2 vUv;

void main() {
    float alpha = smoothstep(1.0, 0.25, length(vUv - 0.5) * 2.0);
    gl_FragColor.rgba = vec4(vec3(0.95), alpha);
}
