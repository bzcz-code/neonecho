vec2 rotate2D(vec2 val, float ang) {
    float s = sin(ang);
    float c = cos(ang);
    mat2 m = mat2(c, -s, s, c);
    return m * val;
}