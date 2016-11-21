# photo-partition
A library to apply linear partitioning algorithm to a set of photos.

## Usage

### partitions(viewports, photoArray, desiredHeight, requestedRows)
- viewports: an object which maps a viewport width to a container width. For example,
in Bootstrap 3, _@media_ queries for `.container` are setup in the following way:

```css
@media (min-width: 1200px)
.container {
  width: 1170px;
}
@media (min-width: 992px)
.container {
  width: 970px;
}
@media (min-width: 768px)
.container {
  width: 750px;
}
```

Having the following structure,

```html
<body>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <!-- photos go in here -->
      </div>
    </div>
  </div>
</body>
```

the `col-xs-12` element with `15px` padding on left and right will have width of `1140px`,
`940px` and `720px` for given `min-width` values.

Therefore, the `viewports` argument will be:

```js
{
    1200: 1140,
    992: 940,
    768: 720,
}
```

- photoArray: an array of photos as objects. Each object must contain both `width` and `height`
properties, or `aspect` property. It can have other values, but they will be removed (_todo: inherit
properties in the returned object_).

- [desiredHeight]: what required height each image is supposed to take. The value will be used to
calculate the total width of all images given their aspect:
`const summedWidth = lib.getSummedWidth(aspects, desiredHeight)`

- [requestedRows]: if desiredHeight is not given, static number of rows can be specified using
this option.

### getCSS(partitions, prefix)
- partitions: an object generated with `partitions` function.
- [prefix='s']: a prefix for every class, e.g., `s` will generate classes `s0`, `s1`, _etc_.

## Example
```javascript
const partitions = require('photo-partition')

const photoList = [
    { url: '/files/cd24b45a-48c3-4f78-a029-7725128e82ef.jpg',
        width: 2448,
        height: 3264,
        aspect: 0.75 },
    { url: '/files/9dc13701-4975-4e45-bbfe-ea6d315b983e.jpg',
        width: 2448,
        height: 3264,
        aspect: 0.75 },
    { url: '/files/91143cde-f06c-4b0b-86e1-9a1dc182fb01.jpg',
        width: 2448,
        height: 3264,
        aspect: 0.75 },
    { url: '/files/6737002f-4fa6-4479-b7eb-bb90271ea359.jpg',
        width: 3264,
        height: 2448,
        aspect: 1.33 },
    { url: '/files/28aac5b5-9a60-445e-b4d6-a51e485745c5.jpg',
        width: 3264,
        height: 2448,
        aspect: 1.33 },
    { url: '/files/d42ee39d-1827-433f-bca0-25c9ddf4abfa.jpg',
        width: 3264,
        height: 2448,
        aspect: 1.33 },
]

const p = partitions.partitions({
    1200: 1140,
    992: 940,
    768: 720,
}, photoList, 250) // partition for bootstrap viewports with desired height of 250
/*
{ '768':
   [ { height: 201, width: 151 },
     { height: 201, width: 151 },
     { height: 201, width: 151 },
     { height: 201, width: 267 },
     { height: 271, width: 360 },
     { height: 271, width: 360 } ],
  '992':
   [ { height: 263, width: 197 },
     { height: 263, width: 197 },
     { height: 263, width: 197 },
     { height: 263, width: 349 },
     { height: 353, width: 469 },
     { height: 353, width: 471 } ],
  '1200':
   [ { height: 183, width: 137 },
     { height: 183, width: 137 },
     { height: 183, width: 137 },
     { height: 183, width: 243 },
     { height: 183, width: 243 },
     { height: 183, width: 243 } ] }
*/

const css = partitions.getCSS(p)
/*
'@media (min-width: 768px) {
    .s0 { width: 151px; height: 201px; }
    .s1 { width: 151px; height: 201px; }
    .s2 { width: 151px; height: 201px; }
    .s3 { width: 267px; height: 201px; }
    .s4 { width: 360px; height: 271px; }
    .s5 { width: 360px; height: 271px; } }
@media (min-width: 992px) {
    .s0 { width: 197px; height: 263px; }
    .s1 { width: 197px; height: 263px; }
    .s2 { width: 197px; height: 263px; }
    .s3 { width: 349px; height: 263px; }
    .s4 { width: 469px; height: 353px; }
    .s5 { width: 471px; height: 353px; } }
@media (min-width: 1200px) {
    .s0 { width: 137px; height: 183px; }
    .s1 { width: 137px; height: 183px; }
    .s2 { width: 137px; height: 183px; }
    .s3 { width: 243px; height: 183px; }
    .s4 { width: 243px; height: 183px; }
    .s5 { width: 243px; height: 183px; } }'
*/

const outputList1 = photoList
    .map((photo, index) => ({
        url: photo.url,
        class: `s${index}`,
    }))
/*
[ { url: '/files/cd24b45a-48c3-4f78-a029-7725128e82ef.jpg',
    class: 's0' },
  { url: '/files/9dc13701-4975-4e45-bbfe-ea6d315b983e.jpg',
    class: 's1' },
  { url: '/files/91143cde-f06c-4b0b-86e1-9a1dc182fb01.jpg',
    class: 's2' },
  { url: '/files/6737002f-4fa6-4479-b7eb-bb90271ea359.jpg',
    class: 's3' },
  { url: '/files/28aac5b5-9a60-445e-b4d6-a51e485745c5.jpg',
    class: 's4' },
  { url: '/files/d42ee39d-1827-433f-bca0-25c9ddf4abfa.jpg',
    class: 's5' } ]
*/

await ctx.render('photos', { css, outputList })
```

_nunjucks_ template:
```html
{% extends "views/layouts/main.html" %}
{% block header %}
  <title>Photos</title>
  <style>
    img.preview {
        width: 100%;
        height: 100%;
    }
    div.preview-div {
        float: left;
        padding: 0.1em;
    }
    {{ css }}
  </style>
{% endblock %}
{% block body %}
  <div>
    {% for photo in outputList %}
      <div class="preview-div {{ photo.class }}"><img class="preview" src="{{ photo.url }}"/></div>
    {% endfor %}
  </div>
{% endblock %}
```

_result html_:
```html
<head>
  <style>
  @media (min-width: 768px) { .s0 { width: 151px; height: 201px; } .s1 { width: 151px; height: 201px; } .s2 { width: 151px; height: 201px; } .s3 { width: 267px; height: 201px; } .s4 { width: 360px; height: 271px; } .s5 { width: 360px; height: 271px; } }\n@media (min-width: 992px) { .s0 { width: 197px; height: 263px; } .s1 { width: 197px; height: 263px; } .s2 { width: 197px; height: 263px; } .s3 { width: 349px; height: 263px; } .s4 { width: 469px; height: 353px; } .s5 { width: 471px; height: 353px; } }\n@media (min-width: 1200px) { .s0 { width: 137px; height: 183px; } .s1 { width: 137px; height: 183px; } .s2 { width: 137px; height: 183px; } .s3 { width: 243px; height: 183px; } .s4 { width: 243px; height: 183px; } .s5 { width: 243px; height: 183px; } }
  </style>
</head>

<body>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <div class="preview-div s0"><img class="preview" src="/files/cd24b45a-48c3-4f78-a029-7725128e82ef.jpg"></div>
        <div class="preview-div s1"><img class="preview" src="/files/9dc13701-4975-4e45-bbfe-ea6d315b983e.jpg"></div>
        <div class="preview-div s2"><img class="preview" src="/files/91143cde-f06c-4b0b-86e1-9a1dc182fb01.jpg"></div>
        <div class="preview-div s3"><img class="preview" src="/files/6737002f-4fa6-4479-b7eb-bb90271ea359.jpg"></div>
        <div class="preview-div s4"><img class="preview" src="/files/28aac5b5-9a60-445e-b4d6-a51e485745c5.jpg"></div>
        <div class="preview-div s5"><img class="preview" src="/files/d42ee39d-1827-433f-bca0-25c9ddf4abfa.jpg"></div>
      </div>
    </div>
  <div>
</body>
```

## Testing
Module is tested with [zoroaster](https://www.npmjs.com/package/zoroaster): `npm test`.