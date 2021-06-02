//
//  UIColor+hex.swift
//  tutanota
//
//  Created by Tutao GmbH on 6/1/21.
//  Copyright © 2021 Tutao GmbH. All rights reserved.
//

import UIKit

@objc
extension UIColor {
  
  /// Convenience constructor to initialiye from the the hex color string.
  /// Supported formats:
  /// #RGB
  /// #RRGGBB
  /// #RRGGBBAA
  @objc
  public convenience init?(hex: String) {
    if hex.hasPrefix("#") {
      let start = hex.index(hex.startIndex, offsetBy: 1)
      var hexColor = String(hex[start...])
      
      if hexColor.count == 6 {
        hexColor += "ff"
      } else if hexColor.count == 3 {
        hexColor = expandShortHex(hex: hexColor) + "ff"
      } else if hexColor.count != 8 {
        return nil
      }
      let r, g, b, a: CGFloat
      
      let scanner = Scanner(string: hexColor)
      var hexNumber: UInt64 = 0
      
      if scanner.scanHexInt64(&hexNumber) {
        r = CGFloat((hexNumber & 0xff000000) >> 24) / 255
        g = CGFloat((hexNumber & 0x00ff0000) >> 16) / 255
        b = CGFloat((hexNumber & 0x0000ff00) >> 8) / 255
        a = CGFloat(hexNumber & 0x000000ff) / 255
        
        self.init(red: r, green: g, blue: b, alpha: a)
        return
      }
    }
    return nil
  }
  
  public func isLight() -> Bool {
    var white: CGFloat = 0
    getWhite(&white, alpha: nil)
    return white > 0.5
  }
}

private func expandShortHex(hex: String) -> String {
  assert(hex.count == 3)
  
  var hexCode = ""
  for char in hex {
    hexCode += String(repeating: char, count: 2)
  }
  return hexCode
}
