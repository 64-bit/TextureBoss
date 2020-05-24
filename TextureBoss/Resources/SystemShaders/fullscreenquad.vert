#version 330 core
//layout (location = 0) in vec3 aPos;

varying vec2 uv;

void main()
{
	vec4 pos;
	switch(gl_VertexID)
	{
		case 0:
			pos = vec4(-1.0,-1.0,0.0,1.0);
			uv = vec2(0.0,0.0);
			break;
		case 1:
			pos = vec4(1.0,-1.0,0.0,1.0);
			uv = vec2(1.0,0.0);
			break;
		case 2:
			pos = vec4(1.0,1.0,0.0,1.0);
			uv = vec2(1.0,1.0);
			break;

		case 3:
			pos = vec4(-1.0,-1.0,0.0,1.0);
			uv = vec2(0.0,0.0);
			break;
		case 4:
			pos = vec4(1.0,1.0,0.0,1.0);
			uv = vec2(1.0,1.0);
			break;
		case 5:
			pos = vec4(-1.0,1.0,0.0,1.0);
			uv = vec2(0.0,1.0);
			break;
	}

    gl_Position = pos;
}