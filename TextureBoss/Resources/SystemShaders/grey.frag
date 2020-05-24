#version 330 core
//layout (location = 0) in vec3 aPos;

varying vec2 uv;

void main()
{
    gl_FragColor = vec4(uv.xy,0.0,1.0);
}