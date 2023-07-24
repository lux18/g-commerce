<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CheckoutController extends Controller
{
    public function placeorder(Request $request)
    {
        if (auth('sanctum')->check()) {
            $validator = Validator::make($request->all(), [
                'name' => 'required|max:191',
                'phone' => 'required|max:191',
                'email' => 'required|max:191',
                'country' => 'required|max:191',
                'full_address' => 'required|max:191',
                'city' => 'required|max:191',

            ]);
            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'errors' => $validator->messages(),
                ]);
            } else {
                $user_id = auth('sanctum')->user()->id;
                $order = new Order;
                $order->user_id = auth('sanctum')->user()->id;
                $order->name = $request->name;
                $order->phone = $request->phone;
                $order->email = $request->email;
                $order->country = $request->country;
                $order->full_address = $request->full_address;
                $order->city = $request->city;

                $order->payment_mode = "COD";
                $order->tracking_no = 'gc' . rand(1111, 9999);
                $order->save();

                $cart = Cart::where('user_id', $user_id)->get();

                $orderitems = [];
                foreach ($cart as $item) {
                    $orderitems[] = [
                        'product_id' => $item->product_id,
                        'qyt' => $item->product_qyt,
                        'price' => $item->product->selling_price,
                    ];
                    $item->product->update([
                        'qyt' => $item->product->qyt - $item->product_qyt
                    ]);
                }

                $order->orderitems()->createMany($orderitems);
                Cart::destroy($cart);

                return response()->json([
                    'status' => 200,
                    'message' => 'Order Successfully',
                ]);
            }

        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Login to Continue',
            ]);
        }
    }
}