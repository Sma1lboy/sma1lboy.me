'use client'
import React, { useState } from 'react'
import { Button, Input } from '@nextui-org/react'

import { calculateColors, Colors } from '.'

const ColorTest: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState('#7C3AED')
  const [colors, setColors] = useState<Colors>(calculateColors(primaryColor))

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value

    setPrimaryColor(newColor)
    setColors(calculateColors(newColor))
  }

  return (
    <div className="p-4">
      <Input
        className="mb-4"
        label="Choose primary color"
        type="color"
        value={primaryColor}
        onChange={handleColorChange}
      />
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(colors).map(([colorName, colorValue]) => (
          <div key={colorName}>
            <h3 className="mb-2 text-lg font-bold">{colorName}</h3>
            {typeof colorValue === 'object' ? (
              Object.entries(colorValue).map(([shade, hex]) => (
                <Button
                  key={shade}
                  className="m-1"
                  style={
                    {
                      backgroundColor: hex,
                      color: Number(shade) > 500 ? 'white' : 'black',
                    } as React.CSSProperties
                  }
                >
                  {shade}: {hex as string}
                </Button>
              ))
            ) : (
              <Button
                className="m-1"
                style={
                  {
                    backgroundColor: colorValue,
                    color: 'white',
                  } as React.CSSProperties
                }
              >
                {colorValue as string}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ColorTest
