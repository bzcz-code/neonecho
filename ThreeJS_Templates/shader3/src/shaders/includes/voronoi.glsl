#define NONE 0.

#define EUCLIDEAN 1
#define MANHATTAN 2
#define CHECYSHEV 3
#define MINKOWSKI 4

#define F1 1
#define F2 2
#define SMOOTH 3
#define DISTANCE_TO_EDGE 4
#define N_SPHERE_RADIUS 5

vec3 Hash_3D_to_3D(vec3 k){
    return vec3(fract(sin(vec3(dot(k,vec3(103,393,293)),dot(k,vec3(593,339,299)),dot(k,vec3(523,334,192))))*2304.2002));
}

float voronoi_distance_3d(vec3 a,vec3 b,int MetricMode,float exponent){
    vec3 distanceVector=b-a;
    if(MetricMode==1)return length(distanceVector);
    if(MetricMode==2)return abs(distanceVector.x)+abs(distanceVector.y)+abs(distanceVector.z);
    if(MetricMode==3)return max(max(abs(distanceVector.x),abs(distanceVector.y)),abs(distanceVector.z));
    if(MetricMode==4)return pow(dot(pow(abs(distanceVector),vec3(exponent)),vec3(1)),1./exponent);
    return 0.;
}

void voronoi_f1(vec3 coord,float expornent,float randomness,int MetricMode,inout float outDistace,inout vec3 outColor,inout vec3 outPosition){
    vec3 cellPosition=floor(coord);
    float minDistance=8.;
    vec3 targetOffset=vec3(0),targetPosition=vec3(0);
    for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++)for(int k=-1;k<=1;k++){
        vec3 cellOffset=vec3(i,j,k);
        vec3 pointPosition=cellOffset+Hash_3D_to_3D(cellPosition+cellOffset)*randomness;
        float distanceToPoint=voronoi_distance_3d(pointPosition,coord-cellPosition,MetricMode,expornent);
        if(distanceToPoint<minDistance){
            minDistance=distanceToPoint;
            targetOffset=cellOffset;
            targetPosition=pointPosition;
        }
    }
    outDistace=minDistance;
    outColor=Hash_3D_to_3D(cellPosition+targetOffset);
    outPosition=targetPosition+cellPosition;
}

void voronoi_f2(vec3 coord,float expornent,float randomness,int MetricMode,inout float outDistace,inout vec3 outColor,inout vec3 outPosition){
    vec3 cellPosition=floor(coord);
    float distF1=8.,distF2=8.;
    vec3 offsetF1=vec3(0),offsetF2=vec3(0),positionF1=vec3(0),positionF2=vec3(0);
    for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++)for(int k=-1;k<=1;k++){
        vec3 cellOffset=vec3(i,j,k);
        vec3 pointPosition=cellOffset+Hash_3D_to_3D(cellPosition+cellOffset)*randomness;
        float distanceToPoint=voronoi_distance_3d(pointPosition,coord-cellPosition,MetricMode,expornent);
        if(distanceToPoint<distF1){
            distF2=distF1;positionF2=positionF1;offsetF2=offsetF1;
            distF1=distanceToPoint;positionF1=pointPosition;offsetF1=cellOffset;
        }else if(distanceToPoint<distF2){
            distF2=distanceToPoint;positionF2=pointPosition;offsetF2=cellOffset;
        }
    }
    outDistace=distF2;
    outColor=Hash_3D_to_3D(cellPosition+offsetF2);
    outPosition=positionF2+cellPosition;
}

void voronoi_smooth(vec3 coord,float smoothness,float exponent,float randomness,int MetricMode,inout float outDistance,inout vec3 outColor,inout vec3 outPosition){
    vec3 cellPosition=floor(coord),localPosition=coord-cellPosition,smoothColor=vec3(0.),smoothPosition=vec3(0.);
    float smoothDistance=8.;
    for(int j=-2;j<=2;j++)for(int i=-2;i<=2;i++)for(int k=-2;k<=2;k++){
        vec3 cellOffset=vec3(i,j,k),pointPosition=cellOffset+Hash_3D_to_3D(cellPosition+cellOffset)*randomness;
        float distanceToPoint=voronoi_distance_3d(pointPosition,localPosition,MetricMode,exponent);
        float h=smoothstep(0.,1.,.5+.5*(smoothDistance-distanceToPoint)/smoothness);
        float correctionFactor=smoothness*h*(1.-h);
        smoothDistance=mix(smoothDistance,distanceToPoint,h)-correctionFactor;
        correctionFactor/=1.+3.*smoothness;
        vec3 cellColor=Hash_3D_to_3D(cellPosition+cellOffset);
        smoothColor=mix(smoothColor,cellColor,h)-correctionFactor;
        smoothPosition=mix(smoothPosition,pointPosition,h)-correctionFactor;
    }
    outDistance=smoothDistance;
    outPosition=cellPosition+smoothPosition;
    outColor=smoothColor;
}

void voronoi_distance_to_edge(vec3 coord,float randomness,inout float outDistance){
    vec3 cellPosition=floor(coord);
    vec3 localPosition=coord-cellPosition;
    float minDistance=8.;
    vec3 pointF1=vec3(0.);
    for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++)for(int k=-1;k<=1;k++){
        vec3 cellOffset=vec3(i,j,k);
        vec3 pointPosition=cellOffset+Hash_3D_to_3D(cellPosition+cellOffset)*randomness-localPosition;
        float distanceToPoint=dot(pointPosition,pointPosition);
        if(distanceToPoint<minDistance){
            minDistance=distanceToPoint;
            pointF1=pointPosition;
        }
    }
    minDistance=8.;
    for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++)for(int k=-1;k<=1;k++){
        vec3 cellOffset=vec3(i,j,k);
        vec3 pointPosition=cellOffset+Hash_3D_to_3D(cellPosition+cellOffset)*randomness-localPosition;
        vec3 perpendicularToEdge=pointPosition-pointF1;
        if(dot(perpendicularToEdge,perpendicularToEdge)>.001){
            float distanceToEdge=dot((pointF1+pointPosition)/2.,normalize(perpendicularToEdge));
            minDistance=min(minDistance,distanceToEdge);
        }
    }
    outDistance=minDistance;
}

void voronoi_n_sphere_radius(vec3 coord,float randomness,inout float outDistance){
    vec3 cellPosition=floor(coord),localPosition=coord-cellPosition,closestPoint=vec3(0.),closestPointOffset=vec3(0.),closestPointToClosestPoint=vec3(0.);
    float minDistance=8.;
    for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++)for(int k=-1;k<=1;k++){
        vec3 cellOffset=vec3(i,j,k),pointPosition=cellOffset+Hash_3D_to_3D(cellPosition+cellOffset)*randomness;
        float distanceToPoint=length(pointPosition-localPosition);
        if(distanceToPoint<minDistance){
            minDistance=distanceToPoint;
            closestPoint=pointPosition;
            closestPointOffset=cellOffset;
        }
    }
    minDistance=8.;
    for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++)for(int k=-1;k<=1;k++){
        if(i==0&&j==0&&k==0)continue;
        vec3 cellOffset=vec3(i,j,k)+closestPointOffset,pointPosition=cellOffset+Hash_3D_to_3D(cellPosition+cellOffset)*randomness;
        float distanceToPoint=length(closestPoint-pointPosition);
        if(distanceToPoint<minDistance){
            minDistance=distanceToPoint;
            closestPointToClosestPoint=pointPosition;
        }
    }
    outDistance=length(closestPointToClosestPoint-closestPoint)*.5;
}

float voronoi(vec3 coord,float randomness,int Version){
    float outDistance;
    if(Version==DISTANCE_TO_EDGE)voronoi_distance_to_edge(coord,randomness,outDistance);
    else if(Version==N_SPHERE_RADIUS)voronoi_n_sphere_radius(coord,randomness,outDistance);
    else{
        vec3 outColor,outPosition;
        voronoi_f1(coord,0.,randomness,EUCLIDEAN,outDistance,outColor,outPosition);
    }
    return outDistance;
}

float voronoi(vec3 coord,float randomness,int Version,int MetricMode){
    float outDistance;
    vec3 outColor,outPosition;
    if(Version==F2)voronoi_f2(coord,NONE,randomness,MetricMode,outDistance,outColor,outPosition);
    else voronoi_f1(coord,NONE,randomness,MetricMode,outDistance,outColor,outPosition);
    return outDistance;
}

float voronoi(vec3 coord,float randomness,int Version,int MetricMode,float smoothnessOrExponent){
    float outDistance;
    vec3 outColor,outPosition;
    if(Version==F2)voronoi_f2(coord,smoothnessOrExponent,randomness,MetricMode,outDistance,outColor,outPosition);
    else if(Version==SMOOTH)voronoi_smooth(coord,smoothnessOrExponent,NONE,randomness,MetricMode,outDistance,outColor,outPosition);
    else voronoi_f1(coord,smoothnessOrExponent,randomness,MetricMode,outDistance,outColor,outPosition);
    return outDistance;
}

float voronoi(vec3 coord,float randomness,int Version,int MetricMode,float exponent,float smoothness){
    float outDistance;
    vec3 outColor,outPosition;
    voronoi_smooth(coord,smoothness,exponent,randomness,MetricMode,outDistance,outColor,outPosition);
    return outDistance;
}