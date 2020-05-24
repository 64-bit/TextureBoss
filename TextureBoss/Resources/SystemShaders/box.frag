#version 330 core
//layout (location = 0) in vec3 aPos;

vec3 backgroundColor = vec3(0,0,0);
const vec3 ambientColor = vec3(0.1,0.1,0.1);

const float rotationSpeedFactor = 1.0;
const int nestingCount = 8;
const float nestingScale = 0.75;

const vec3 lightDirection = normalize(vec3(-1,-1,-1));
//const vec3 surfaceColor = vec3(0.72,0.45,0.2);
const vec3 surfaceColor = vec3(0.5,0.6,0.7);

const float surfaceMetalness = 0.0;
const float surfaceRoughness = 0.5;
const float surfaceR2 = surfaceRoughness*surfaceRoughness;

const float PI = 3.1415926;

const vec3 light1Dir = vec3(-1.0,-1.0,-1.0);
const vec3 light1Color = vec3(1.0,1.0,1.0);

uniform float uTime;

varying vec2 uv;


float saturate(float value)
{
 	return clamp(value,0.0,1.0);   
}

vec3 saturate(vec3 value)
{
 	return clamp(value,0.0,1.0);   
}

float ggx_dist(vec3 halfAngle, vec3 normal, float roughness)
{
	float NoH = dot(normal, halfAngle);
    if(NoH <= 0.0)
    {
     return 0.0;   
    }
    
    float r2 = roughness*roughness;
    float NoH2 = NoH * NoH;
    
    float denom = NoH2 * (r2 - 1.0) + 1.0;
    
    
    return 1.0;
    
    //return saturate(r2 / (PI * denom * denom));
}

float ggxGeoPartial(vec3 incidentAngle, vec3 normal, vec3 halfAngle, float roughness)
{
    float VoH = saturate(dot(incidentAngle, halfAngle));
    float VoN = saturate(dot(incidentAngle, normal));
    float chi = (VoH / VoN);
    
    if(chi <=0.0)
    {
		return 0.0;
    }
    
    float VoH2 = VoH * VoH;
    float r2 = roughness * roughness;
    
    float tan2 = (1.0 - VoH2) / VoH2;
    
    float num = 2.0 * VoN;
    float denom = (VoH + sqrt(r2 + (1.0-r2) * VoN * VoN));
    
    return (num/denom);
}

float ggx_geo(vec3 incomming, vec3 outgoing, vec3 normal, vec3 halfAngle, float roughness)
{
	float inc = ggxGeoPartial(incomming, normal, halfAngle, roughness);  	   
    float outg = ggxGeoPartial(outgoing, normal, halfAngle, roughness);  	
    return inc * outg;
}

vec3 schlickFresnel(vec3 viewDir, vec3 halfAngle, vec3 surfaceColor, float metalness)
{
    vec3 F0 = vec3(0.04,0.04,0.04);
    F0 = mix(F0, surfaceColor, metalness);
    
    float VoH = dot(viewDir, halfAngle);
    float power = pow(1.0-VoH,5.0);
    
    return F0 + (vec3(1.0,1.0,1.0) - F0) * power;
}

vec3 TrashPBRSpecular(vec3 viewRay, vec3 surfaceNormal, vec3 reflection)
{
	vec3 invViewRay = normalize(-viewRay);
    
    
    float NoL = saturate(dot(reflection, surfaceNormal));
    float NoV = saturate(dot(invViewRay, surfaceNormal));
    vec3 halfAngle = normalize(invViewRay + reflection);
    
    
    float distrubtion = ggx_dist(halfAngle,surfaceNormal, surfaceRoughness*surfaceRoughness);
    float geometry = ggx_geo(invViewRay, reflection, surfaceNormal, halfAngle, surfaceRoughness);
    vec3 fresnel = schlickFresnel(invViewRay, halfAngle, surfaceColor, surfaceMetalness);
    
    fresnel = mix(fresnel, vec3(1.0,1.0,1.0), surfaceMetalness * 1.0);
    
    
    float num = (distrubtion * geometry);
    float denom = 4.0 * NoV;
    
    vec3 reflectance = geometry * fresnel;
    
    
    //float value = distrubtion;
    //return fresnel;
    
    //return reflectance;
    
	return vec3(reflectance);
}

vec3 TrashPBRDiffuse(vec3 surfaceNormal)
{
	vec3 diffuseCubemap = vec3(0.0,0.0,0.0);
	return diffuseCubemap * surfaceColor;
}

vec3 TrashPBR(vec3 viewRay, vec3 surfaceNormal)
{
    vec3 reflection = normalize(reflect(viewRay, surfaceNormal));
	vec3 specularCubemap = vec3(0.0,0.0,0.0);
    
    
    vec3 specularReflectance = TrashPBRSpecular(viewRay, surfaceNormal, reflection);        
    vec3 surfaceColorDiffuse = TrashPBRDiffuse(surfaceNormal);
    
    //return surfaceColorSpecular;   
    
    float NoL = dot(surfaceNormal, reflection);
    
    
    vec3 specularContribution = specularReflectance * specularCubemap;
    vec3 diffuseContribution = surfaceColorDiffuse * ( vec3(1.0,1.0,1.0) - specularReflectance);
    
        
    vec3 finalColor = specularContribution + diffuseContribution;
    
    //return specularCubemap;

    
    vec3 finalColor2 = dot(surfaceNormal, light1Dir) * surfaceColor * light1Color;
    //finalColor2 += TrashPBRDiffuse(surfaceNormal);
    return saturate(finalColor2);
}



float nestingScaleAnimation()
{
 	return mix(0.5,1.0, abs(sin(uTime*0.1)));   
}

mat4 constructViewMatrix(vec3 eye, vec3 center, vec3 up)
{
    
	vec3 a = normalize(center - eye);
    vec3 b = normalize(cross(a, up));
    vec3 c = cross(b,a);
                    
    return  mat4(
        	vec4(b,0),
        	vec4(c,0),
        	vec4(-a, 0),
        	vec4(0,0,0,1));
}

vec3 rayDirection(float fov, vec2 rtSize, vec2 fragCoord)
{	
    vec2 xy = fragCoord - (rtSize / 2.0);
    float z = rtSize.y / tan(radians(fov) / 2.0);
    return normalize(vec3(xy, -z));
}

float sphereSDF(vec3 p) 
{
    return length(p) - 1.0;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdRoundBox( vec3 p, vec3 b, float r )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}


float opSubtraction( float d1, float d2 ) { return max(-d1,d2); }

float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h); }


float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }

float sceneSDF(vec3 worldPos)
{
    float scale = 1.0;
    
    float finalDist = 10000000.0;
    
    
    
    for(int i = 0; i < nestingCount;i++)
    {
        float box = sdRoundBox(worldPos/scale, vec3(0.8,0.8,0.8),0.02);  
    	float sphere = sphereSDF(worldPos/scale);
    	float cutout = opSmoothSubtraction(sphere,box, 0.05) * scale;
        
        finalDist = opSmoothUnion(finalDist, cutout,0.05);
        scale *= nestingScaleAnimation();
    }
    
    //return sphereSDF(worldPos);
           
    //return sphere;
    return finalDist;
}

const int MAX_MARCHING_STEPS = 255;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const float EPSILON = 0.0001;

float spherecastScene(vec3 eyePos, vec3 rayDir, float start, float end)
{
	float depth = start;
    
    for(int i = 0; i < MAX_MARCHING_STEPS;i++)
    {
        float dist = sceneSDF(eyePos + (depth * rayDir));
        if(dist < EPSILON)
        {
        	return depth;   
        }
      	depth += dist;
        if(depth >= end)                                 
        {
            return end;   
        }
    }
    return end;
}

float spherecastSceneForExit(vec3 eyePos, vec3 rayDir, float start, float end)
{
	float depth = start;
    
    for(int i = 0; i < MAX_MARCHING_STEPS;i++)
    {
        float dist = sceneSDF(eyePos + (depth * rayDir));
        if(dist > -EPSILON)
        {
        	return depth;   
        }
      	depth += max(0.05 * EPSILON, abs(dist));
        if(depth >= end)                                 
        {
            return end;   
        }
    }
    return end;
}


vec3 getSurfaceNormal(vec3 worldPos, float currentDist)
{
    float x = sceneSDF(worldPos + vec3(EPSILON,0,0)) - sceneSDF(worldPos - vec3(EPSILON,0,0));
    float y = sceneSDF(worldPos + vec3(0,EPSILON,0)) - sceneSDF(worldPos - vec3(0,EPSILON,0));
    float z = sceneSDF(worldPos + vec3(0,0,EPSILON)) - sceneSDF(worldPos - vec3(0,0,EPSILON));

    return normalize(vec3(x,y,z));
}

const float LTPOWER = 0.5;
const float LT_AMBIENT = 0.55;

vec3 shadeTranslucent(vec3 normal, vec3 lightDir, vec3 invView, vec3 lightColor, float thickness)
{
	vec3 LTLight = normal + -lightDir;
    float dt = pow(saturate(dot(invView, -LTLight)),LTPOWER) * 1.0;
    float LT = (dt + LT_AMBIENT) * thickness;
    
    return surfaceColor * lightColor * LT;
}


void main()
{
	vec2 fragCoord = uv * 1024;
    vec2 iResolution = vec2(1024.0,1024.0);

    vec3 rayDir = rayDirection(80.0, iResolution.xy, fragCoord);
    vec3 eyePos = vec3(10.0 * sin(uTime*rotationSpeedFactor) ,sin(uTime * 0.25) * 5.0 , 10.0 * cos(uTime*rotationSpeedFactor));
    //vec3 eyePos = vec3(-10 ,sin(10.0 * 0.05) * 5.0 , -10);

    mat4 viewMatrix = constructViewMatrix(eyePos, vec3(0,0,0), vec3(0,1,0));
    viewMatrix = inverse(viewMatrix);
    
    rayDir = (vec4(rayDir,0) * viewMatrix).xyz;
    
    float distToSurface = spherecastScene(eyePos, rayDir, MIN_DIST, MAX_DIST);
    
    if(distToSurface < MAX_DIST)
    {
        
        distToSurface += 20.0 * EPSILON;
        
        float distToExit = spherecastSceneForExit(eyePos, rayDir, distToSurface,MAX_DIST);
        
        float ssDistance = distToExit - distToSurface;
        
        ssDistance = (ssDistance * 2.0)  - 1.0;        
        ssDistance *= 0.3;      
        ssDistance = 0.09 + ssDistance;
        
        ssDistance = saturate(ssDistance);
        
        if(distToExit < MAX_DIST)
        {
            
         	//fragColor =  vec4(ssDistance,ssDistance,ssDistance,1.0);   
            //return;
        }
        else   
        {
          ssDistance = 0.0;  
        }
            
        vec3 surfaceNormal = getSurfaceNormal(eyePos + rayDir * distToSurface, distToSurface);
        
        vec3 envColor = TrashPBR(rayDir, surfaceNormal);   
        //envColor = vec3(0.1,0.5,0.7);
        
        float surfaceAlpha = 0.5;
        
        
        vec3 envPassthrough = vec3(0.0,0.0,0.0);
        //envPassthrough *= surfaceColor;
        
        ssDistance = 1.0 - ssDistance;
        
        vec3 lightSSS = shadeTranslucent(surfaceNormal, -light1Dir, -rayDir, light1Color, ssDistance);
        vec3 envSSS = shadeTranslucent(surfaceNormal, -rayDir, -rayDir, envPassthrough, ssDistance);

        
        vec3 finalColor = envColor + lightSSS;
        
     	gl_FragColor = vec4(lightSSS + envSSS,1);
        return;
    }

    
    //vec3 backCubemap = texture(iChannel1, rayDir).xyz;
    //backCubemap = vec3(0);
    // Output to screen
    gl_FragColor = vec4(0.0,0.0,0.0,1.0);
}