/**
 * jQuery Roundabout Shapes v2
 * http://fredhq.com/projects/roundabout-shapes/
 * 
 * Provides additional paths along which items can move for the
 * jQuery Roundabout plugin (v1.0+).
 *
 * Terms of Use // jQuery Roundabout Shapes
 *
 * Open source under the BSD license
 *
 * Copyright (c) 2009-2011, Fred LeBlanc
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions are met:
 * 
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above 
 *     copyright notice, this list of conditions and the following 
 *     disclaimer in the documentation and/or other materials provided 
 *     with the distribution.
 *   - Neither the name of the author nor the names of its contributors 
 *     may be used to endorse or promote products derived from this 
 *     software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE 
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE.
 */
jQuery.extend(jQuery.roundaboutShapes,{theJuggler:function(b,c,d){return{x:Math.sin(b+c),y:Math.tan(Math.exp(Math.log(b))+c)/(d-1),z:(Math.cos(b+c)+1)/2,scale:Math.sin(b+Math.PI/2+c)/2+0.5}},figure8:function(b,c,d){return{x:Math.sin(2*b+c),y:Math.sin(b+Math.PI/2+c)/8*d,z:(Math.cos(b+c)+1)/2,scale:Math.sin(b+Math.PI/2+c)/2+0.5}},waterWheel:function(b,c,d){return{x:Math.sin(b+Math.PI/2+c)/8*d,y:Math.sin(b+c)/(Math.PI/2),z:(Math.cos(b+c)+1)/2,scale:Math.sin(b+Math.PI/2+c)/2+0.5}},square:function(b,c,d){var e,f,g;return b<=Math.PI/2?(e=2/Math.PI*b,f=-(2/Math.PI)*b+1,g=-(1/Math.PI)*b+1):b>Math.PI/2&&b<=Math.PI?(e=-(2/Math.PI)*b+2,f=-(2/Math.PI)*b+1,g=-(1/Math.PI)*b+1):b>Math.PI&&b<=3*Math.PI/2?(e=-(2/Math.PI)*b+2,f=2/Math.PI*b-3,g=1/Math.PI*b-1):(e=2/Math.PI*b-4,f=2/Math.PI*b-3,g=1/Math.PI*b-1),{x:e,y:f*d,z:g,scale:g}},conveyorBeltLeft:function(b,c,d){return{x:-Math.cos(b+c),y:Math.cos(b+3*Math.PI/2+c)/8*d,z:(Math.sin(b+c)+1)/2,scale:Math.sin(b+Math.PI/2+c)/2+0.5}},conveyorBeltRight:function(b,c,d){return{x:Math.cos(b+c),y:Math.cos(b+3*Math.PI/2+c)/8*d,z:(Math.sin(b+c)+1)/2,scale:Math.sin(b+Math.PI/2+c)/2+0.5}},goodbyeCruelWorld:function(b,c,d){return{x:Math.sin(b+c),y:Math.tan(b+3*Math.PI/2+c)/8*(d+0.5),z:(Math.sin(b+c)+1)/2,scale:Math.sin(b+Math.PI/2+c)/2+0.5}},diagonalRingLeft:function(b,c,d){return{x:Math.sin(b+c),y:-Math.cos(b+Math.tan(Math.cos(c)))/(d+1.5),z:(Math.cos(b+c)+1)/2,scale:Math.sin(b+Math.PI/2+c)/2+0.5}},diagonalRingRight:function(b,c,d){return{x:Math.sin(b+c),y:Math.cos(b+Math.tan(Math.cos(c)))/(d+1.5),z:(Math.cos(b+c)+1)/2,scale:Math.sin(b+Math.PI/2+c)/2+0.5}},rollerCoaster:function(b,c,d){return{x:Math.sin(b+c),y:Math.sin((2+d)*b),z:(Math.cos(b+c)+1)/2,scale:Math.sin(b+Math.PI/2+c)/2+0.5}},tearDrop:function(b,c,d){return{x:Math.sin(b+c),y:-Math.sin(b/2+d)+0.35,z:(Math.cos(b+c)+1)/2,scale:Math.sin(b+Math.PI/2+c)/2+0.5}},tickingClock:function(b,c){return{x:Math.cos(b+c-Math.PI/2),y:Math.sin(b+c-Math.PI/2),z:Math.cos(b),scale:Math.cos(b)+0.5}},flurry:function(b,c,d){return{x:Math.sin(3*b+c),y:Math.cos(b+Math.PI/2+c)/2*d,z:(Math.cos(b+c)+1)/2,scale:Math.sin(b+Math.PI/2+c)/2+0.5}},nowSlide:function(b,c,d){return{x:0.5*Math.tan(2*b+c),y:Math.cos(2*b+d)/6,z:(Math.cos(b+c)+1)/2,scale:Math.sin(b+Math.PI/2+c)/2+0.5}},risingEssence:function(b,c,d){return{x:Math.sin(b+c),y:Math.tan((2+d)*b),z:(Math.cos(b+c)+1)/2,scale:Math.sin(b+Math.PI/2+c)/2+0.5}}});