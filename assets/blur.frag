precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform vec2 texelSize;
uniform float grunge;
uniform float grunge2;

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float noise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec4 blur(float amp){
	//this will be our RGBA sum
    vec4 sum = vec4(0.0);
    
    //our original texcoord for this fragment
    vec2 tc = vTexCoord;

    //the amount to blur, i.e. how far off center to sample from 
    //1.0 -> blur by one pixel
    //2.0 -> blur by two pixels, etc.
    float radius = grunge2*amp;
    vec2 blur = radius*texelSize; 
    
    //the direction of our blur
    //(1.0, 0.0) -> x-axis blur
    //(0.0, 1.0) -> y-axis blur
    vec2 dir = vec2(1., .2);
    float hstep = dir.x;
    float vstep = dir.y;

    //apply blurring, using a 9-tap filter with predefined gaussian weights
    
    sum += texture2D(tex0, vec2(tc.x - 4.0*blur.x*hstep, tc.y - 4.0*blur.y*vstep)) * 0.0162162162;
    sum += texture2D(tex0, vec2(tc.x - 3.0*blur.x*hstep, tc.y - 3.0*blur.y*vstep)) * 0.0540540541;
    sum += texture2D(tex0, vec2(tc.x - 2.0*blur.x*hstep, tc.y - 2.0*blur.y*vstep)) * 0.1216216216;
    sum += texture2D(tex0, vec2(tc.x - 1.0*blur.x*hstep, tc.y - 1.0*blur.y*vstep)) * 0.1945945946;
    
    sum += texture2D(tex0, vec2(tc.x, tc.y)) * 0.2270270270;
    
    sum += texture2D(tex0, vec2(tc.x + 1.0*blur.x*hstep, tc.y + 1.0*blur.y*vstep)) * 0.1945945946;
    sum += texture2D(tex0, vec2(tc.x + 2.0*blur.x*hstep, tc.y + 2.0*blur.y*vstep)) * 0.1216216216;
    sum += texture2D(tex0, vec2(tc.x + 3.0*blur.x*hstep, tc.y + 3.0*blur.y*vstep)) * 0.0540540541;
    sum += texture2D(tex0, vec2(tc.x + 4.0*blur.x*hstep, tc.y + 4.0*blur.y*vstep)) * 0.0162162162;

    return sum;
}

vec4 distort(){
	vec2 uv = vTexCoord;
	// the texture is loaded upside down and backwards by default so lets flip it
	//uv = 1.0 - uv;

	// a single pass blur works by sampling all the neighbor pixels and averaging them up
	// this is somewhat inefficient because we have to sample the texture 9 times -- texture2D calls are slow :( 
	// check out the two-pass-blur example for a better blur approach
	// get the webcam as a vec4 using texture2D

	// spread controls how far away from the center we should pull a sample from
	// you will start to see artifacts if you crank this up too high
	float spread = 4.0;

	// create our offset variable by multiplying the size of a texel with spread
	vec2 offset = texelSize * spread;

	// get all the neighbor pixels!
	float amp = .4*grunge;
	float nx = amp*(-.5 + noise(uv/texelSize*.008+31.3414));
	float ny = amp*(-.5 + noise(uv/texelSize*.008+1891.88314));
	vec2 duv = texelSize * vec2(nx, ny);


	float amp2 = .2 + .3*grunge;
	float nx2 = amp2*(-.5 + noise(uv/texelSize*.13+31.3414));
	float ny2 = amp2*(-.5 + noise(uv/texelSize*.13+1891.88314));
	vec2 duv2 = texelSize * vec2(nx2, ny2);

	vec4 tex = texture2D(tex0, uv + duv*0. + duv2); // middle middle -- the actual texel / pixel
	//tex += texture2D(tex0, uv + vec2(-offset.x, -offset.y)); // top left
	//tex += texture2D(tex0, uv + vec2(0.0, -offset.y)); // top middle
	//tex += texture2D(tex0, uv + vec2(offset.x, -offset.y)); // top right

	//tex += texture2D(tex0, uv + vec2(-offset.x, 0.0)); //middle left
	//tex += texture2D(tex0, uv + vec2(offset.x, 0.0)); //middle right

	//tex += texture2D(tex0, uv + vec2(-offset.x, offset.y)); // bottom left
	//tex += texture2D(tex0, uv + vec2(0.0, offset.y)); // bottom middle
	//tex += texture2D(tex0, uv + vec2(offset.x, offset.y)); // bottom right

	// we added 9 textures together, so we will divide by 9 to average them out and move the values back into a 0 - 1 range
	//tex /= 9.0;
	return tex;
}

vec4 salt(){
	vec2 uv = vTexCoord;

	vec4 tex = vec4(noise((uv+grunge2*.1+grunge*.1)/texelSize/2.));
	tex.a = 1.0;

	return tex;
}

void main() {
	vec4 n = salt();
	vec4 d = distort();
	vec4 b = blur(3.);

	vec4 res = d + (b-d)*pow(grunge2, 1.5) + n*.06;

	res.g *= 1. - (.03*(mod(grunge2+grunge, 1.0)));
	res.b *= 1. - (.042*(mod(grunge2+grunge, 1.0)));

	gl_FragColor = res;
	//gl_FragColor = blur();
}