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
              Ma trận:
            </Label>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <Button
                variant={activeFilters.sepia ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => handleSimpleFilterToggle("sepia", 3, F.Sepia)}
              >
                Sepia
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
                Brownie
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
                Technicolor
              </Button>
              <Button
                variant={activeFilters.kodachrome ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() =>
                  handleSimpleFilterToggle("kodachrome", 18, F.Kodachrome)
                }
              >
                Kodachrome
              </Button>
              <Button
                variant={activeFilters.polaroid ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() =>
                  handleSimpleFilterToggle("polaroid", 15, F.Polaroid)
                }
              >
                Polaroid
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
                Nổi bật
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageFilterPanel;
