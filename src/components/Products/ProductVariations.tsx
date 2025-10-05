import React, { useState } from 'react';
import { Plus, X, Edit3 } from 'lucide-react';
import { ProductVariation, VariationOption } from '../../types';

interface ProductVariationsProps {
  variations: ProductVariation[];
  onVariationsChange: (variations: ProductVariation[]) => void;
}

const ProductVariations: React.FC<ProductVariationsProps> = ({
  variations,
  onVariationsChange
}) => {
  const [editingVariation, setEditingVariation] = useState<string | null>(null);
  const [newVariationName, setNewVariationName] = useState('');

  const addVariation = () => {
    if (!newVariationName.trim()) return;
    
    const newVariation: ProductVariation = {
      id: `var-${Date.now()}`,
      name: newVariationName,
      options: []
    };
    
    onVariationsChange([...variations, newVariation]);
    setNewVariationName('');
  };

  const removeVariation = (variationId: string) => {
    onVariationsChange(variations.filter(v => v.id !== variationId));
  };

  const addOption = (variationId: string) => {
    const newOption: VariationOption = {
      id: `opt-${Date.now()}`,
      value: '',
      priceModifier: 0,
      inventory: 0
    };
    
    onVariationsChange(
      variations.map(v => 
        v.id === variationId 
          ? { ...v, options: [...v.options, newOption] }
          : v
      )
    );
  };

  const updateOption = (variationId: string, optionId: string, updates: Partial<VariationOption>) => {
    onVariationsChange(
      variations.map(v => 
        v.id === variationId 
          ? {
              ...v,
              options: v.options.map(o => 
                o.id === optionId ? { ...o, ...updates } : o
              )
            }
          : v
      )
    );
  };

  const removeOption = (variationId: string, optionId: string) => {
    onVariationsChange(
      variations.map(v => 
        v.id === variationId 
          ? { ...v, options: v.options.filter(o => o.id !== optionId) }
          : v
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Product Variations
        </h3>
        <span className="text-sm text-gray-500">
          Add options like size, color, etc.
        </span>
      </div>

      {/* Add New Variation */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Variation name (e.g., Size, Color)"
          value={newVariationName}
          onChange={(e) => setNewVariationName(e.target.value)}
          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <button
          onClick={addVariation}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={16} className="mr-1" />
          Add
        </button>
      </div>

      {/* Existing Variations */}
      {variations.map((variation) => (
        <div key={variation.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-800 dark:text-white">
              {variation.name}
            </h4>
            <button
              onClick={() => removeVariation(variation.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {variation.options.map((option) => (
              <div key={option.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <input
                  type="text"
                  placeholder="Option value"
                  value={option.value}
                  onChange={(e) => updateOption(variation.id, option.id, { value: e.target.value })}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="Price modifier"
                    value={option.priceModifier}
                    onChange={(e) => updateOption(variation.id, option.id, { priceModifier: parseFloat(e.target.value) || 0 })}
                    className="pl-7 p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Inventory"
                  value={option.inventory}
                  onChange={(e) => updateOption(variation.id, option.id, { inventory: parseInt(e.target.value) || 0 })}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => removeOption(variation.id, option.id)}
                  className="text-red-500 hover:text-red-700 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            <button
              onClick={() => addOption(variation.id)}
              className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded text-gray-500 hover:text-teal-600 hover:border-teal-400 transition-colors"
            >
              + Add Option
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductVariations;