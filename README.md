# Just some random comments

### Code Style - nothing special
- void is used to ensure non leaking arrow functions
- The dispatcher.onEventName syntax is used for event handlers that are not to be removed at any point in time
- The addEventListener syntax is used for 

### Notes

- Buffer Objects: are memory locations we request webgl to assign to certain variables for us, this is important as gl ES the language of webgl is not a dynamic language. There are two types of gl buffers: the ARRAY_BUFFER which contains vertex objects and the ELEMENT_ARRAY_BUFFER which contains index values pointing to vertex data
- gl.vertexAttrib[1234]f is used to assign a value to an attribute, gl.vertexAttribPointer is used to assign an array of values


#### aside

- Every create method in webgl has a corresponding delete method. createProgram => deleteProgram, createShader => deleteShader, createBuffer => deleteBuffer
- 