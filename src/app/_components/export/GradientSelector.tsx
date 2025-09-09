"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Edit } from "lucide-react";
import { memo, useCallback, useState } from "react";

export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export interface GradientOptions {
  type: "linear" | "radial";
  angle: number; // for linear gradients
  stops: GradientStop[];
}

interface GradientSelectorProps {
  value: GradientOptions;
  onChange: (gradient: GradientOptions) => void;
  disabled?: boolean;
}

const DEFAULT_GRADIENT: GradientOptions = {
  type: "linear",
  angle: 90,
  stops: [
    { color: "#ffffff", position: 0 },
    { color: "#000000", position: 100 },
  ],
};

export const GradientSelector = memo(function GradientSelector({
  value = DEFAULT_GRADIENT,
  onChange,
  disabled = false,
}: GradientSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTypeChange = useCallback(
    (type: "linear" | "radial") => {
      onChange({ ...value, type });
    },
    [value, onChange]
  );

  const handleAngleChange = useCallback(
    (angle: number[]) => {
      onChange({ ...value, angle: angle[0] ?? 0 });
    },
    [value, onChange]
  );

  const handleStopChange = useCallback(
    (index: number, stop: GradientStop) => {
      const newStops = [...value.stops];
      newStops[index] = stop;
      onChange({ ...value, stops: newStops });
    },
    [value, onChange]
  );

  const addStop = useCallback(() => {
    if (value.stops.length >= 4) return;
    const newStops = [...value.stops];
    const lastStop = newStops[newStops.length - 1];
    if (!lastStop) return;
    newStops.push({
      color: "#ffffff",
      position: Math.min(lastStop.position + 25, 100),
    });
    onChange({ ...value, stops: newStops });
  }, [value, onChange]);

  const removeStop = useCallback(
    (index: number) => {
      if (value.stops.length <= 2) return;
      const newStops = value.stops.filter((_, i) => i !== index);
      onChange({ ...value, stops: newStops });
    },
    [value, onChange]
  );

  const generateGradientCSS = useCallback(() => {
    const stops = value.stops
      .sort((a, b) => a.position - b.position)
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    if (value.type === "linear") {
      return `linear-gradient(${value.angle}deg, ${stops})`;
    }
    return `radial-gradient(circle, ${stops})`;
  }, [value]);

  return (
    <div className="flex flex-col space-y-2 px-4">
      <Label className="font-semibold text-sm">Background Gradient</Label>

      <div className="flex flex-row-reverse gap-3 space-x-3 space-y-0">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className=" items-center justify-between ">
            <DialogTrigger asChild>
              <Button
                variant="default"
                disabled={disabled}
                className="size-[35px] bg-primary hover:bg-primary/90"
              >
                <Edit className="size-[25px]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Gradient Settings</DialogTitle>
                <DialogDescription>
                  Customize your gradient background with colors, type, and
                  angle.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Gradient Type */}
                <div className="space-y-2">
                  <Label>Gradient Type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={value.type === "linear" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTypeChange("linear")}
                      disabled={disabled}
                    >
                      Linear
                    </Button>
                    <Button
                      variant={value.type === "radial" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTypeChange("radial")}
                      disabled={disabled}
                    >
                      Radial
                    </Button>
                  </div>
                </div>

                {/* Angle Control (for linear gradients) */}
                {value.type === "linear" && (
                  <div className="space-y-2">
                    <Label>Angle: {Math.round(value.angle)}°</Label>
                    <Slider
                      value={[value.angle]}
                      onValueChange={handleAngleChange}
                      min={0}
                      max={360}
                      step={0.1}
                      disabled={disabled}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Color Stops */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Color Stops ({value.stops.length}/4)</Label>
                    {value.stops.length < 4 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={addStop}
                        disabled={disabled}
                      >
                        + Add Stop
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {value.stops.map((stop, index) => (
                      <div
                        key={`stop-${index}`}
                        className="flex items-center gap-3"
                      >
                        <Input
                          type="color"
                          value={stop.color}
                          onChange={(e) =>
                            handleStopChange(index, {
                              ...stop,
                              color: e.target.value,
                            })
                          }
                          className="h-10 w-16 cursor-pointer"
                          disabled={disabled}
                        />
                        <div className="flex-1 space-y-1">
                          <Slider
                            value={[stop.position]}
                            onValueChange={(position) =>
                              handleStopChange(index, {
                                ...stop,
                                position: position[0] ?? 0,
                              })
                            }
                            min={0}
                            max={100}
                            step={0.01}
                            disabled={disabled}
                            className="w-full"
                          />
                          <div className="text-center text-muted-foreground text-xs">
                            {stop.position.toFixed(2)}%
                          </div>
                        </div>
                        {value.stops.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStop(index)}
                            disabled={disabled}
                            className="text-destructive hover:text-destructive"
                          >
                            x
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </div>
        </Dialog>

        {/* Gradient Preview */}
        <div
          className="h-12 w-full rounded-md border border-border bg-muted/20 p-1"
          style={{
            background: generateGradientCSS(),
          }}
        />
      </div>
    </div>
  );
});
