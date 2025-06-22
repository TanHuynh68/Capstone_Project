import React from "react";
import { fabric } from "fabric";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FilterValues {
  brightness: number;
  contrast: number;
  saturation: number;
  vibrance: number;
  noise: number;
  pixelate: number;
  blur: number;
  gamma: number[];
  hue: number;
  removeColorDistance: number;
  removeColorColor: string;
  blendColor: string;
  blendMode: string;
  blendAlpha: number;
  grayscaleMode: string;
}

interface ActiveFilters {
  grayscale: boolean;
  invert: boolean;
  removeColor: boolean;
  sepia: boolean;
  brownie: boolean;
  brightness: boolean;
  contrast: boolean;
  saturation: boolean;
  vibrance: boolean;
  noise: boolean;
  vintage: boolean;
  pixelate: boolean;
  blur: boolean;
  sharpen: boolean;
  emboss: boolean;
  technicolor: boolean;
  polaroid: boolean;
  blendColor: boolean;
  gamma: boolean;
  kodachrome: boolean;
  blackwhite: boolean;
  hue: boolean;
}

interface ImageFilterPanelProps {
  isFilterEnabled: boolean;
  setIsFilterEnabled: (v: boolean) => void;
  filterValues: FilterValues;
  setFilterValues: (v: FilterValues) => void;
  activeFilters: ActiveFilters;
  setActiveFilters: (v: ActiveFilters) => void;
  applyFilter: (idx: number, filter: fabric.IBaseFilter | null) => void;
  applyFilterValue: (
    idx: number,
    prop: string,
    value: string | number | number[]
  ) => void;
  clearAllFilters: () => void;
}

const ImageFilterPanel: React.FC<ImageFilterPanelProps> = ({
  isFilterEnabled,
  setIsFilterEnabled,
  filterValues,
  setFilterValues,
  activeFilters,
  setActiveFilters,
  applyFilter,
  applyFilterValue,
  clearAllFilters,
}) => {
  const F = fabric.Image.filters as unknown as Record<
    string,
    new (options?: object) => fabric.IBaseFilter
  >;

  const handleMainFilterToggle = (checked: boolean) => {
    setIsFilterEnabled(checked);
    if (!checked) {
      clearAllFilters();
    }
  };

  const handleGrayscaleModeChange = (
    mode: "average" | "lightness" | "luminosity"
  ) => {
    setFilterValues({ ...filterValues, grayscaleMode: mode });

    const isGrayscaleActive =
      activeFilters.grayscale && filterValues.grayscaleMode === mode;
    if (isGrayscaleActive) {
      // If the button clicked is already active, turn off grayscale
      setActiveFilters({ ...activeFilters, grayscale: false });
      applyFilter(0, null);
    } else {
      // Otherwise, turn it on with the new mode
      setActiveFilters({ ...activeFilters, grayscale: true });
      applyFilter(0, new F.Grayscale({ mode }));
    }
  };

  const handleSimpleFilterToggle = (
    filterName: keyof ActiveFilters,
    filterIndex: number,
    filterClass: new (options?: object) => fabric.IBaseFilter,
    options: object = {}
  ) => {
    const newValue = !activeFilters[filterName];
    setActiveFilters({ ...activeFilters, [filterName]: newValue });
    applyFilter(filterIndex, newValue ? new filterClass(options) : null);
  };

  const renderSlider = (
    name: string,
    label: string,
    filterIndex: number,
    filterClass: new (options?: object) => fabric.IBaseFilter,
    filterOption: object,
    min: number,
    max: number,
    step: number,
    toFixed: number = 0
  ) => {
    const key = name.toLowerCase() as keyof FilterValues;
    const value = filterValues[key];

    // Convert value from -100 to 100 range to -1 to 1 range for Fabric.js
    const convertValue = (val: number): number => {
      if (
        name === "brightness" ||
        name === "contrast" ||
        name === "saturation" ||
        name === "vibrance"
      ) {
        return val / 100;
      }
      return val;
    };

    return (
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-xs text-muted-foreground">{label}:</label>
          <span className="text-xs font-medium">
            {Number(value).toFixed(toFixed)}
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={
            typeof value === "number"
              ? value
              : Array.isArray(value)
              ? value[0]
              : 0
          }
          onChange={(e) => {
            const numValue = parseFloat(e.target.value);
            setFilterValues({ ...filterValues, [key]: numValue });
            if (activeFilters[key as keyof ActiveFilters]) {
              applyFilterValue(
                filterIndex,
                Object.keys(filterOption)[0],
                convertValue(numValue)
              );
            }
          }}
          onPointerDown={() => {
            if (!activeFilters[key as keyof ActiveFilters]) {
              setActiveFilters({
                ...activeFilters,
                [key as keyof ActiveFilters]: true,
              });
              applyFilter(
                filterIndex,
                new filterClass({
                  ...filterOption,
                  [Object.keys(filterOption)[0]]: convertValue(
                    typeof value === "number"
                      ? value
                      : Array.isArray(value)
                      ? value[0]
                      : 0
                  ),
                })
              );
            }
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          disabled={!isFilterEnabled}
        />
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Bộ lọc hình ảnh
        </div>
        <Switch
          id="filter-toggle"
          checked={isFilterEnabled}
          onCheckedChange={handleMainFilterToggle}
        />
      </div>

      {isFilterEnabled && (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">
              Thang xám:
            </Label>
            <div className="flex gap-1 mt-1">
              {(["lightness", "average", "luminosity"] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={
                    activeFilters.grayscale &&
                    filterValues.grayscaleMode === mode
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleGrayscaleModeChange(mode)}
                >
                  {mode === "lightness"
                    ? "Nhẹ"
                    : mode === "average"
                    ? "Vừa"
                    : "Sáng"}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-muted-foreground">
              Chế độ:
            </Label>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <Button
                variant={activeFilters.invert ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => handleSimpleFilterToggle("invert", 1, F.Invert)}
              >
                Đảo ngược
              </Button>
              <Button
                variant={activeFilters.sharpen ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() =>
                  handleSimpleFilterToggle("sharpen", 12, F.Convolute, {
                    matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
                  })
                }
              >
                Làm sắc nét
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">
              Bộ lọc:
            </Label>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <Button
                variant={activeFilters.sepia ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => handleSimpleFilterToggle("sepia", 3, F.Sepia)}
              >
                Nâu đỏ
              </Button>
              <Button
                variant={activeFilters.blackwhite ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() =>
                  handleSimpleFilterToggle("blackwhite", 19, F.BlackWhite)
                }
              >
                Đen trắng
              </Button>
              <Button
                variant={activeFilters.brownie ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() =>
                  handleSimpleFilterToggle("brownie", 4, F.Brownie)
                }
              >
                Nâu ấm
              </Button>
              <Button
                variant={activeFilters.vintage ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() =>
                  handleSimpleFilterToggle("vintage", 9, F.Vintage)
                }
              >
                Cổ điển
              </Button>
              <Button
                variant={activeFilters.technicolor ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() =>
                  handleSimpleFilterToggle("technicolor", 14, F.Technicolor)
                }
              >
                Phim màu
              </Button>
              <Button
                variant={activeFilters.kodachrome ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() =>
                  handleSimpleFilterToggle("kodachrome", 18, F.Kodachrome)
                }
              >
                Máy ảnh
              </Button>
              <Button
                variant={activeFilters.polaroid ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() =>
                  handleSimpleFilterToggle("polaroid", 15, F.Polaroid)
                }
              >
                Phân cực
              </Button>
              <Button
                variant={activeFilters.emboss ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() =>
                  handleSimpleFilterToggle("emboss", 13, F.Convolute, {
                    matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
                  })
                }
              >
                Chạm nổi
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-muted-foreground">
              Màu sắc:
            </Label>
            <div className="space-y-2 mt-1">
              {renderSlider(
                "brightness",
                "Độ sáng",
                5,
                F.Brightness,
                { brightness: 0 },
                -100,
                100,
                1,
                0
              )}
              {renderSlider(
                "contrast",
                "Độ tương phản",
                6,
                F.Contrast,
                { contrast: 0 },
                -100,
                100,
                1,
                0
              )}
              {renderSlider(
                "saturation",
                "Độ bão hòa",
                7,
                F.Saturation,
                { saturation: 0 },
                -100,
                100,
                1,
                0
              )}
              {renderSlider(
                "vibrance",
                "Độ rực rỡ",
                8,
                F.Vibrance,
                { vibrance: 0 },
                -100,
                100,
                1,
                0
              )}
              {renderSlider(
                "hue",
                "Tông màu",
                21,
                F.HueRotation,
                { rotation: 0 },
                -180,
                180,
                1,
                0
              )}
              {renderSlider(
                "noise",
                "Nhiễu",
                9,
                F.Noise,
                { noise: 0 },
                0,
                1000,
                1,
                0
              )}
              {renderSlider(
                "pixelate",
                "Pixel hóa",
                10,
                F.Pixelate,
                { blocksize: 2 },
                2,
                30,
                1,
                0
              )}
              {renderSlider(
                "blur",
                "Làm mờ",
                11,
                F.Blur,
                { blur: 0 },
                0,
                1,
                0.01,
                2
              )}

              {/* Gamma sliders for RGB */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-muted-foreground">
                    Gamma Đỏ:
                  </label>
                  <span className="text-xs font-medium">
                    {Number(filterValues.gamma[0]).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={filterValues.gamma[0]}
                  onChange={(e) => {
                    const numValue = parseFloat(e.target.value);
                    const newGamma = [...filterValues.gamma];
                    newGamma[0] = numValue;
                    setFilterValues({ ...filterValues, gamma: newGamma });
                    if (activeFilters.gamma) {
                      applyFilterValue(16, "gamma", newGamma);
                    }
                  }}
                  onPointerDown={() => {
                    if (!activeFilters.gamma) {
                      setActiveFilters({ ...activeFilters, gamma: true });
                      const newGamma = [...filterValues.gamma];
                      newGamma[0] = filterValues.gamma[0];
                      applyFilter(16, new F.Gamma({ gamma: newGamma }));
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  disabled={!isFilterEnabled}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-muted-foreground">
                    Gamma Xanh lá:
                  </label>
                  <span className="text-xs font-medium">
                    {Number(filterValues.gamma[1]).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={filterValues.gamma[1]}
                  onChange={(e) => {
                    const numValue = parseFloat(e.target.value);
                    const newGamma = [...filterValues.gamma];
                    newGamma[1] = numValue;
                    setFilterValues({ ...filterValues, gamma: newGamma });
                    if (activeFilters.gamma) {
                      applyFilterValue(16, "gamma", newGamma);
                    }
                  }}
                  onPointerDown={() => {
                    if (!activeFilters.gamma) {
                      setActiveFilters({ ...activeFilters, gamma: true });
                      const newGamma = [...filterValues.gamma];
                      newGamma[1] = filterValues.gamma[1];
                      applyFilter(16, new F.Gamma({ gamma: newGamma }));
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  disabled={!isFilterEnabled}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-muted-foreground">
                    Gamma Xanh dương:
                  </label>
                  <span className="text-xs font-medium">
                    {Number(filterValues.gamma[2]).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={filterValues.gamma[2]}
                  onChange={(e) => {
                    const numValue = parseFloat(e.target.value);
                    const newGamma = [...filterValues.gamma];
                    newGamma[2] = numValue;
                    setFilterValues({ ...filterValues, gamma: newGamma });
                    if (activeFilters.gamma) {
                      applyFilterValue(16, "gamma", newGamma);
                    }
                  }}
                  onPointerDown={() => {
                    if (!activeFilters.gamma) {
                      setActiveFilters({ ...activeFilters, gamma: true });
                      const newGamma = [...filterValues.gamma];
                      newGamma[2] = filterValues.gamma[2];
                      applyFilter(16, new F.Gamma({ gamma: newGamma }));
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  disabled={!isFilterEnabled}
                />
              </div>
            </div>
          </div>

          {/* Blend Color Controls */}
          <div>
            <Label className="text-xs font-medium text-muted-foreground">
              Pha trộn màu:
            </Label>
            <div className="space-y-2 mt-1">
              {/* Color Picker */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-muted-foreground">
                    Màu pha trộn:
                  </label>
                  <span className="text-xs font-medium">
                    {filterValues.blendColor}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={filterValues.blendColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      setFilterValues({
                        ...filterValues,
                        blendColor: newColor,
                      });
                      if (activeFilters.blendColor) {
                        applyFilterValue(17, "color", newColor);
                      }
                    }}
                    className="w-12 h-8 p-0 border rounded"
                  />
                  <input
                    type="text"
                    value={filterValues.blendColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      setFilterValues({
                        ...filterValues,
                        blendColor: newColor,
                      });
                      if (activeFilters.blendColor) {
                        applyFilterValue(17, "color", newColor);
                      }
                    }}
                    className="flex-1 h-8 px-2 text-xs border rounded"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* Blend Mode Selector */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  Chế độ pha trộn:
                </label>
                <select
                  value={filterValues.blendMode}
                  onChange={(e) => {
                    const newMode = e.target.value;
                    setFilterValues({ ...filterValues, blendMode: newMode });
                    if (activeFilters.blendColor) {
                      applyFilterValue(17, "mode", newMode);
                    }
                  }}
                  className="w-full h-8 px-2 text-xs border rounded bg-background"
                  disabled={!isFilterEnabled}
                >
                  <option value="add">Cộng</option>
                  <option value="diff">Khác biệt</option>
                  <option value="subtract">Trừ</option>
                  <option value="multiply">Nhân</option>
                  <option value="screen">Sàng lọc</option>
                  <option value="lighten">Sáng hơn</option>
                  <option value="darken">Tối hơn</option>
                  <option value="exclusion">Loại trừ</option>
                </select>
              </div>

              {/* Alpha Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-muted-foreground">
                    Độ trong suốt:
                  </label>
                  <span className="text-xs font-medium">
                    {Number(filterValues.blendAlpha).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={filterValues.blendAlpha}
                  onChange={(e) => {
                    const numValue = parseFloat(e.target.value);
                    setFilterValues({ ...filterValues, blendAlpha: numValue });
                    if (activeFilters.blendColor) {
                      applyFilterValue(17, "alpha", numValue);
                    }
                  }}
                  onPointerDown={() => {
                    if (!activeFilters.blendColor) {
                      setActiveFilters({ ...activeFilters, blendColor: true });
                      applyFilter(
                        17,
                        new F.BlendColor({
                          color: filterValues.blendColor,
                          mode: filterValues.blendMode,
                          alpha: filterValues.blendAlpha,
                        })
                      );
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  disabled={!isFilterEnabled}
                />
              </div>

              {/* Blend Color Toggle Button */}
              <Button
                variant={activeFilters.blendColor ? "default" : "outline"}
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  const newValue = !activeFilters.blendColor;
                  setActiveFilters({ ...activeFilters, blendColor: newValue });
                  if (newValue) {
                    applyFilter(
                      17,
                      new F.BlendColor({
                        color: filterValues.blendColor,
                        mode: filterValues.blendMode,
                        alpha: filterValues.blendAlpha,
                      })
                    );
                  } else {
                    applyFilter(17, null);
                  }
                }}
              >
                {activeFilters.blendColor
                  ? "Tắt Pha trộn màu"
                  : "Bật Pha trộn màu"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageFilterPanel;
