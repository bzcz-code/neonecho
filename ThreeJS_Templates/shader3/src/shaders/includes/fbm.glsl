#include ./math.glsl
#include ./noise.glsl

float o=8.;
float f(float x){float v=0.,a=.5,s=100.;for(int i=0;i<o;++i){v+=a*noise(x);x=x*2.+s;a*=.5;}return v;}
float f(vec2 x){float v=0.,a=.5;vec2 s=vec2(100.);mat2 r=mat2(cos(.5),sin(.5),-sin(.5),cos(.5));for(int i=0;i<o;++i){v+=a*noise(x);x=r*x*2.+s;a*=.5;}return v;}
float f(vec3 x){float v=0.,a=.5;vec3 s=vec3(100.);for(int i=0;i<o;++i){v+=a*noise(x);x=x*2.+s;a*=.5;}return v;}
const mat2 m=mat2(.8,-.6,.6,.8);
float f(vec2 p){float f=0.;f+=.5*noise(p);p=m*p*2.02;f+=.25*noise(p);p=m*p*2.03;f+=.125*noise(p);p=m*p*2.01;f+=.0625*noise(p);return f/.9375;}