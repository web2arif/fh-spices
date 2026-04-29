import { supabase } from '@/lib/supabase';
import { formatINR, formatPackSize } from '@/lib/utils';

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('is_active', true);

  if (error) return <div className="p-8">Error: {error.message}</div>;

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">FH Spices</h1>
      <p className="text-gray-600 mb-8">Day 1 smoke test — database connection working</p>
      <div className="space-y-6">
        {products?.map((p) => (
          <div key={p.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-500 capitalize mb-3">
              {p.category.replace('_', ' ')}
              {p.is_seasonal && ' • seasonal'}
            </p>
            <p className="text-sm mb-3">{p.description}</p>
            <div className="flex flex-wrap gap-2">
              {p.variants?.map((v: any) => (
                <span
                  key={v.id}
                  className="text-xs bg-gray-100 text-gray-900 px-2 py-1 rounded"
                >
                  {formatPackSize(v.pack_size_grams)} — {formatINR(v.price_inr)}
                  {v.spice_level && ` • ${v.spice_level}`}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}