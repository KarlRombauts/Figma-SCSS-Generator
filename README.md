# Figma style generator

## Please note that this is currently a proof of concept and is not ready to be used. I hope this proves to be useful to anyone who is also playing around with Figma's API

## Overview
This tool allows a user to export a scss file containing all the font, gradient, and color variables for a given document. Functionality could be expanded to include standard button styles and general component styles.

## Usage
- Users download the style guide template file and create a style guide in figma. 
  - The template document has named artboards which needed by the tool to identify the components on the artboard and how to handle them.
- Users copy and paste the artboard ID into the text field on the tool
- Users click generate style
- The tool outputs a typography.scss file, colors.scss file and a variables.scss file

## Specification

### Colors
#### Flat Colors
1. RGB values get stored into an object with the following properties:
    1. `name`: string (eg. `'$blue'`)
    2. `r`: int (0 - 255)
    3. `g`: int (0 - 255)
    4. `b`: int (0 - 255)
    5. `a`: float (0.0 - 1.0)
    6. `hex`: string (eg. `'#e567a0'`)
    7. `cssColor`: string (valid css color definition) 
    8. `reference`: string (eg. `'$blue'`), reference to another color by color name, default (`None`)
2. HEX code is generated from RBG colors and saved as `hex` on the color object.
3. cssColor value is generated
    1. If `a !== 0`;
        1. cssColor = `rgba(hex, a)`
    2. else;
        1. cssColor = `hex`
4. The color name is assigned based on the name of the object on the figma file.
    1. text is converted to lowercase.
    2. spaces get converted to hyphens. 
    3. `$` is prepended to the name.
5. The color object is pushed into the `flatColors` array.
4. SCSS is generated
    1. For each color object:
        1. a color variable is defined
            1. eg. `$blue: #0000ff;`
        2. a number of css selectors are created
            1. `.color-<color-name>` sets `color`
            2. `.bg-<color-name>` sets `background-color`
   
#### Gradients
1. Figma object on colors artboard is checked if it contains a gradient. 
    1. Gradient objects get processed after all colors are processed
2. A gradient object is created containing properties:
    1. `name`: string (eg `'green-gradient'`)
    2. `colors`: array of strings, references color name ( see flat colors )
    3. `gradientHandles`: array of floats 
    4. `angle`: float (0.0 - 360.0)
3. For each gradient a series of new color objects are created with the names `<gradient-name>-position-<num>` 
4. Each new color is pushed to the the `gradientColors` array
5. Each color in the gradient is checked with the existing colors in the `flatColors` array
6. if no color variable exists;
    1. the color object created in step 4 is populated as per the specification for flat colors
7. if the color variable does exist;
    1. the color object is populated with a reference to the flat color variable name.
8. `angle` is calculated trigonometrically by taking the start and end positions of the gradient handles 
9. SCSS is generated
    1. For each gradient object:
        1. two gradient variables are defined
            1. normal: eg. `$blue-gradient: linear-gradient(0deg, $blue-gradient-1 0%, $blue-gradient-2 100%);`
            2. reversed: eg. `$blue-gradient-reversed: linear-gradient(0deg, $blue-gradient-2 0%, $blue-gradient-1 100%);`
        2. a number of css selectors are created
            1. `.bg-<gradient-name>` sets `background-color` to gradient
            2. `.bg-<gradient-name>-reversed` sets `background-color` to reversed gradient 
### Typography
1. Each text object on the figma fonts artboard is processed
    1. Desktop fonts should be suffixed with `-lg` on the figma file. 
    2. Mobile fonts should be suffixed with `-xs` on the figma file.
    3. Tablet fonts do not need to be specified as they will be interpolated.
    4. standard 
1. for each font group (eg. `h1-lg`, `h1-xs`) a font group object is created:
    1. `name`: sting (group name eg. `h1`)
    2. `sizes`: object of typography objects {`xs`, `sm`, `md`, `lg`}
    3. `classes`: array of strings (eg `['h1', '.font-style-one']`) 
2. Data from the figma json file populates a typography object is created for `xs` and `lg` containing the following properties:
    1. `name`: string (generated based on figma names (eg. `h1-lg`))
    2. `color`: string, references color name ( see flat colors )
    3. `font-family`: string
    4. `font-weight`: int
    5. `fontSize`: int
    6. `textAlignVertical`: string
    7. `letterSpacing`: int,
    8. `lineHeightPercent`: int
3. data for `sm` and `md` are generated through interpolation of `xs` and `lg`
    1. `sm = xs + (lg - xs)/3`
    2. `md = xs + (2 * (lg - xs))/3`
4. SCSS is generated
    1. For each font group object a css selector is created
        1. joining array or classes on a `,` (`h1, .font-style-one`) 
        2. this gives each of the heading tags automatic styling as well as the possibility of overriding the style using the `font-style` class.
    2. each size maps to a media query eg `@include('>md')`
   
